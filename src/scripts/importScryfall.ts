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
const IMPORT_METADATA_PATH = path.join(DATA_DIR, 'import-metadata.json');

async function getBulkMetadata() {
    console.log("🔍 Checking bulk data info...");
    const res = await axios.get('https://api.scryfall.com/bulk-data');
    const bulkDefault = res.data.data.find((entry: any) => entry.type === 'default_cards');

    return {
        updated_at: bulkDefault.updated_at,
        download_uri: bulkDefault.download_uri,
        size: bulkDefault.size,
    };
}

async function getLocalBulkMetadata() {
    console.log("Checking local data info...");
    if (!fs.existsSync(METADATA_PATH)) {
        return null;
    }

    try {
        const data = fs.readFileSync(METADATA_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.log("⚠️ Error with metadata file, will re-download");
        return null;
    }
}

async function saveBulkMetadata(metadata) {
    fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));
}

async function getImportMetadata() {
    if (!fs.existsSync(IMPORT_METADATA_PATH)) {
        return null;
    }

    try {
        const data = fs.readFileSync(IMPORT_METADATA_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.log("⚠️ Error with import metadata file");
        return null;
    }
}

async function saveImportMetadata(bulkMetadata, stats) {
    const importMeta = {
        last_import_date: new Date().toISOString(),
        bulk_updated_at: bulkMetadata.updated_at,
        bulk_size: bulkMetadata.size,
        import_stats: {
            card_added: stats.cardsAdded,
            sets_added: stats.setsAdded,
            printings_added: stats.printingsAdded,
            total_processed: stats.total_processed,
        }
    };

    fs.writeFileSync(IMPORT_METADATA_PATH, JSON.stringify(importMeta, null, 2));
    console.log("📝 Import metadata saved");
}

async function downloadBulkData() {
    console.log("Downloading Bulk data...");

    const metadata = await getBulkMetadata();
    const url = metadata.download_uri;

    console.log(`Downloading from ${url}`);
    const res = await axios.get(url, {responseType: 'stream'});

    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, {recursive: true});
    }

    const writer = fs.createWriteStream(BULK_PATH);
    res.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', async () => {
            console.log("Bulk data downloaded successfully!");
            await saveBulkMetadata(metadata);
            resolve(metadata);
        });
        writer.on('error', (err) => {
            reject(err);
        })
    });
}

async function checkAndUpdateBulkData() {
    try {
        const [localBulkMeta, remoteMeta] = await Promise.all([
            getLocalBulkMetadata(),
            getBulkMetadata()
        ]);

        if (!fs.existsSync(BULK_PATH) || !localBulkMeta) {
            console.log("📥 No local bulk data found, downloading...");
            const metadata = await downloadBulkData();
            return {hasNewData: true, metadata};
        }

        const localDate = new Date(localBulkMeta.updated_at);
        const remoteDate = new Date(remoteMeta.updated_at);

        if (remoteDate > localDate) {
            console.log(`New data available ! Local = ${localDate.toISOString()}, Remote= ${remoteDate.toISOString()}`);
            const metadata = await downloadBulkData();
            return {hasNewData: true, metadata};
        } else {
            console.log("Local data is up to date ✅");
            return {hasNewData: false, metadata: localBulkMeta};
        }
    } catch (error) {
        console.error("❌ Error checking bulk data:", error.message);
        if (!fs.existsSync(BULK_PATH)) {
            throw error;
        }
        console.log("⚠️ Using existing local data due to network error");
        const localMeta = await getLocalBulkMetadata();
        return {hasNewData: false, metadata: localMeta};
    }
}

async function shouldRunImport(bulkMetadata) {
    const importMeta = await getImportMetadata();
    if (!importMeta) {
        console.log("🆕 First import, will process all data");
        return true;
    }

    const bulkDate = new Date(bulkMetadata.updated_at);
    const lastImportBulkDate = new Date(importMeta.bulk_updated_at);

    if (bulkDate > lastImportBulkDate) {
        console.log("🆕 Bulk data is newer than last import");
        console.log(`   Last import was from: ${lastImportBulkDate.toISOString()}`);
        console.log(`   Current bulk data:    ${bulkDate.toISOString()}`);
        return true;
    }

    console.log("✅ Database is already up to date with current bulk data");
    console.log(`   Last import: ${importMeta.last_import_date}`);
    console.log(`   Bulk data:   ${importMeta.bulk_updated_at}`);
    console.log(`   Stats: +${importMeta.import_stats.cards_added} cards, +${importMeta.import_stats.sets_added} sets, +${importMeta.import_stats.printings_added} printings`);
    return false;
}

async function importCards() {

    console.log("🚀 Starting import process...");

    const {hasNewData, metadata} = await checkAndUpdateBulkData();

    const shouldImport = await shouldRunImport(metadata);

    if (!shouldImport) {
        console.log("🎯 No import needed, exiting gracefully");
        return;
    }

    console.log("💪 Starting database import...");

    const rawData = JSON.parse(fs.readFileSync(BULK_PATH, "utf-8"));
    await AppDataSource.initialize();

    const cardRepo = AppDataSource.getRepository(Card);
    const setRepo = AppDataSource.getRepository(cardSet);
    const printingRepo = AppDataSource.getRepository(Card_printing);

    console.log("🔄 Loading existing data...");

    const [existingCards, existingSets, existingPrintings] = await Promise.all([
        cardRepo.find({select: ['oracle_id']}),
        setRepo.find({select: ['code']}),
        printingRepo.find({select: ['id']}),
    ]);

    const existingOracleIds = new Set(existingCards.map(c => c.oracle_id));
    const existingSetCodes = new Set(existingSets.map(s => s.code));
    const existingPrintingIds = new Set(existingPrintings.map(p => p.id));

    console.log(`📊 Existing: ${existingOracleIds.size} cards, ${existingSetCodes.size} sets, ${existingPrintingIds.size} printings`);

    const cardsToUpsert = [];
    const setsToUpsert = [];
    const printingsToUpsert = [];
    const processedSets = new Set();

    console.log("🔄 Processing entries for upsert...");
    let count = 0;
    let newCardsCount = 0;
    let newSetsCount = 0;
    let newPrintingsCount = 0;

    for (const entry of rawData) {
        if (!entry.oracle_id || entry.layout === 'token') continue;

        cardsToUpsert.push({
            oracle_id: entry.oracle_id,
            name: entry.name,
            type_line: entry.type_line,
            oracle_text: entry.oracle_text,
            cmc: entry.cmc,
            power: entry.power,
            toughness: entry.toughness,
        });

        if (!existingOracleIds.has(entry.oracle_id)) {
            newCardsCount++;
        }

        if (!processedSets.has(entry.set)) {
            setsToUpsert.push({
                code: entry.set,
                name: entry.set_name,
                release_date: new Date(entry.released_at),
                set_type: entry.set_type,
            });

            processedSets.add(entry.set);

            if (!existingSetCodes.has(entry.set)) {
                newSetsCount++;
            }
        }

        printingsToUpsert.push({
            id: entry.id,
            card: {oracle_id: entry.oracle_id},
            set: {code: entry.set},
            collector_number: entry.collector_number,
            rarity: entry.rarity,
            image_uris: entry.image_uris ?? null,
            flavor_text: entry.flavor_text ?? null,
            artist: entry.artist ?? null,
        });

        if (!existingPrintingIds.has(entry.id)) {
            newPrintingsCount++;
        }
        count++;
        if (count % 10000 === 0) {
            console.log(`🔄 Processed ${count} entries...`);
        }
    }

    console.log(`📈 To upsert: ${cardsToUpsert.length} cards, ${setsToUpsert.length} sets, ${printingsToUpsert.length} printings`);

    const BATCH_SIZE = 1000;
    if (cardsToUpsert.length > 0) {
        console.log("💾 Inserting cards...");
        for (let i = 0; i < cardsToUpsert.length; i += BATCH_SIZE) {
            const batch = cardsToUpsert.slice(i, i + BATCH_SIZE);
            await cardRepo.upsert(batch, ['oracle_id']);
            console.log(`   📦 Cards batch ${Math.ceil((i + 1) / BATCH_SIZE)}/${Math.ceil(cardsToUpsert.length / BATCH_SIZE)}`);
        }
    }

    if (setsToUpsert.length > 0) {
        console.log("💾 Inserting sets...");
        for (let i = 0; i < setsToUpsert.length; i += BATCH_SIZE) {
            const batch = setsToUpsert.slice(i, i + BATCH_SIZE);
            await setRepo.upsert(batch, ['code']);
            console.log(`   📦 Sets batch ${Math.ceil((i + 1) / BATCH_SIZE)}/${Math.ceil(setsToUpsert.length / BATCH_SIZE)}`);
        }
    }

    if (printingsToUpsert.length > 0) {
        console.log("💾 Inserting printings...");
        for (let i = 0; i < printingsToUpsert.length; i += BATCH_SIZE) {
            const batch = printingsToUpsert.slice(i, i + BATCH_SIZE);
            await printingRepo.upsert(batch, ['id']);
            console.log(`   📦 Printings batch ${Math.ceil((i + 1) / BATCH_SIZE)}/${Math.ceil(printingsToUpsert.length / BATCH_SIZE)}`);
        }
    }

    const stats = {
        cardsAdded: newCardsCount,
        setsAdded: newSetsCount,
        printingsAdded: newPrintingsCount,
        totalProcessed: count,
        cardsUpserted: cardsToUpsert.length,
        setsUpserted: setsToUpsert.length,
        printingsUpserted: printingsToUpsert.length,
    };

    await saveImportMetadata(metadata, stats);

    console.log("✅ Import finished!");
    console.log(`📊 Final stats: +${newCardsCount} new cards, +${newSetsCount} new sets, +${newPrintingsCount} new printings`);
    console.log(`🔄 Total upserted: ${cardsToUpsert.length} cards, ${setsToUpsert.length} sets, ${printingsToUpsert.length} printings`);

    process.exit(0);
}

importCards().then();
