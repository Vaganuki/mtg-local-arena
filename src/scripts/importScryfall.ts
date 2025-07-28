import * as fs from 'fs';
import * as path from 'path';
import {AppDataSource} from "../data-source";
import {Card} from "../entity/Card";
import {cardSet} from "../entity/CardSet";
import {Card_printing} from "../entity/Card_printing";
import axios from "axios";

const DATA_DIR = path.resolve(__dirname, '../../data');
const BULK_PATH = path.join(DATA_DIR, 'default-cards.json');
const METADATA_PATH = path.join(DATA_DIR, 'bulk-metadata.json');

async function getBulkMetadata() {
    console.log("Checking bulk data info...");
    const res = await axios.get('https://api.scryfall.com/bulk-data');
    const bulkDefault = res.data.data.find((entry: any) => entry.type === 'default_cards');

    return {
        updated_at: bulkDefault.updated_at,
        download_uri: bulkDefault.download_uri,
        size: bulkDefault.size,
    };
}

async function getLocalMetadata() {
    console.log("Checking local data info...");
    if(!fs.existsSync(METADATA_PATH)) {
        return null;
    }

    try {
        const data = fs.readFileSync(METADATA_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.log("Error with metadata file, will re-download");
        return null;
    }
}

async function saveMetadata(metadata) {
    fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));
}

async function downloadBulkData() {
    console.log("Downloading Bulk data...");

    const metadata = await getBulkMetadata();
    const url = metadata.download_uri;

    console.log(`Downloading from ${url}`);
    const res= await axios.get(url, {responseType: 'stream'});

    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, {recursive: true});
    }

    const writer = fs.createWriteStream(BULK_PATH);
    res.data.pipe(writer);

    return new Promise<void>((resolve, reject) => {
        writer.on('finish', async () => {
            console.log("Bulk data downloaded successfully!");
            await saveMetadata(metadata);
            resolve();
        });
        writer.on('error', (err) => {
            reject(err);
        })
    });
}

async function checkAndUpdateBulkData() {
    try {
        const [localMeta, remoteMeta] = await Promise.all([
            getLocalMetadata(),
            getBulkMetadata()
        ]);

        if(!fs.existsSync(BULK_PATH) || !localMeta) {
            console.log("No local data found, downloading...");
            await downloadBulkData();
            return;
        }

        const localDate = new Date(localMeta.updated_at);
        const remoteDate = new Date(remoteMeta.updated_at);

        if(remoteDate > localDate) {
            console.log(`New data available ! Local = ${localDate.toISOString()}, Remote= ${remoteDate.toISOString()}`);
            await downloadBulkData();
        } else {
            console.log("Local data is up to date ✅");
        }
    } catch (error) {
        console.log("Error checking bulk data:",error);
        if (!fs.existsSync(BULK_PATH)) {
            throw error;
        }
    }
}

async function importCards() {

    await checkAndUpdateBulkData();

    const rawData = JSON.parse(fs.readFileSync(BULK_PATH, "utf-8"));
    await AppDataSource.initialize();

    const cardRepo = AppDataSource.getRepository(Card);
    const setRepo = AppDataSource.getRepository(cardSet);
    const printingRepo = AppDataSource.getRepository(Card_printing);

    console.log("🔄 Loading existing data...");

    const [existingCards, existingSets, existingPrintings] = await Promise.all([
        cardRepo.find({select:['oracle_id']}),
        setRepo.find({select:['code']}),
        printingRepo.find({select:['id']}),
    ]);

    const existingOracleIds = new Set(existingCards.map(c => c.oracle_id));
    const existingSetCodes = new Set(existingSets.map(s => s.code));
    const existingPrintingIds = new Set(existingPrintings.map(p => p.id));

    console.log(`📊 Existing: ${existingOracleIds.size} cards, ${existingSetCodes.size} sets, ${existingPrintingIds.size} printings`);

    const newCards = [];
    const newSets = [];
    const newPrintings = [];
    const processedSets = new Set();

    console.log("🔄 Processing entries...");
    let count = 0;

    for (const entry of rawData) {
        if (!entry.oracle_id || entry.layout === 'token') continue;

        if(!existingOracleIds.has(entry.oracle_id)){
            newCards.push({
                oracle_id: entry.oracle_id,
                name: entry.name,
                type_line: entry.type_line,
                oracle_text: entry.oracle_text,
                cmc: entry.cmc,
                power: entry.power,
                toughness: entry.toughness,
            });
            existingOracleIds.add(entry.oracle_id);
        }

        if(!existingSetCodes.has(entry.set) && !processedSets.has(entry.set)) {
            newSets.push({
                code: entry.set,
                name: entry.set_name,
                release_date: new Date(entry.released_at),
                set_type: entry.set_type,
            })
            existingSetCodes.add(entry.set);
            processedSets.add(entry.set);
        }
        if (!existingPrintingIds.has(entry.id)){
            newPrintings.push({
                id: entry.id,
                card:{oracle_id: entry.oracle_id},
                set:{ code: entry.set},
                collector_number: entry.collector_number,
                rarity: entry.rarity,
                image_uris: entry.image_uris?? null,
                flavor_text: entry.flavor_text?? null,
                artist: entry.artist?? null,
            });
            existingPrintings.push(entry.id);
        }
        count++;
        // console.log(`✅ ${count} cartes traitées...`);
        if (count % 10000 === 0) {
            console.log(`🔄 Processed ${count} entries...`);
        }
    }

    console.log(`📈 To insert: ${newCards.length} cards, ${newSets.length} sets, ${newPrintings.length} printings`);

    const BATCH_SIZE = 1000;
    if (newCards.length > 0) {
        console.log("💾 Inserting cards...");
        for(let i = 0; i < newCards.length; i+= BATCH_SIZE) {
            const batch = newCards.slice(i, i + BATCH_SIZE);
            await cardRepo.insert(batch);
            console.log(`📦 Cards batch ${Math.ceil((i + 1) / BATCH_SIZE)}/${Math.ceil(newCards.length / BATCH_SIZE)}`);
        }
    }

    if (newSets.length > 0) {
        console.log("💾 Inserting sets...");
        for (let i = 0; i < newSets.length; i += BATCH_SIZE) {
            const batch = newSets.slice(i, i + BATCH_SIZE);
            await setRepo.insert(batch);
            console.log(`📦 Sets batch ${Math.ceil((i + 1) / BATCH_SIZE)}/${Math.ceil(newSets.length / BATCH_SIZE)}`);
        }
    }

    if(newPrintings.length > 0) {
        console.log("💾 Inserting printings...");
        for (let i = 0; i < newPrintings.length; i += BATCH_SIZE) {
            const batch = newPrintings.slice(i, i + BATCH_SIZE);
            await printingRepo.insert(batch);
            console.log(`📦 Printings batch ${Math.ceil((i + 1) / BATCH_SIZE)}/${Math.ceil(newPrintings.length / BATCH_SIZE)}`);
        }
    }

    console.log("✅ Import finished!");
    console.log(`📊 Final stats: +${newCards.length} cards, +${newSets.length} sets, +${newPrintings.length} printings`);
    process.exit(0);
}

importCards().then();
