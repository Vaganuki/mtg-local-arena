import * as fs from 'fs';
import * as path from 'path';
import {AppDataSource} from "../data-source";
import {Card} from "../entity/Card";
import {Set} from "../entity/Set";
import {Card_printing} from "../entity/Card_printing";
import axios from "axios";

const DATA_DIR = path.resolve(__dirname, '../../data');
const BULK_PATH = path.join(DATA_DIR, 'default-cards.json');


async function downloadBulkData(){
    console.log("Downloading Bulk");
    const res = await axios.get('https://api.scryfall.com/bulk-data');
    const bulkDefault = res.data.data.find((entry : any) => entry.type === 'default_cards');
    const url = bulkDefault.download_uri;

    console.log(`Downloading Bulk Data from: ${url}`);
    const response = await axios.get(url, {responseType: 'stream'});

    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR);
    }

    const writer = fs.createWriteStream(BULK_PATH);
    response.data.pipe(writer);

    return new Promise<void>((resolve , reject) => {
        writer.on('finish', () => {
           console.log('Finished Bulk Data');
           resolve();
        });
        writer.on('error', (err) => {
            reject(err);
        });
    });
}

async function importCards() {

    if(!fs.existsSync(BULK_PATH)) {
        await downloadBulkData();
    }

    const rawData = JSON.parse(fs.readFileSync(BULK_PATH, "utf-8"));

    await AppDataSource.initialize();

    const cardRepo = AppDataSource.getRepository(Card);
    const setRepo = AppDataSource.getRepository(Set);
    const printingRepo = AppDataSource.getRepository(Card_printing);


    let count = 0;


    for (const entry of rawData) {
        if (!entry.oracle_id || entry.layout === 'token') continue;

        const existingCard = await cardRepo.findOneBy({oracle_id: entry.oracle_id});
        if (!existingCard) {
            const card = cardRepo.create({
                oracle_id: entry.oracle_id,
                name: entry.name,
                type_line: entry.type_line,
                oracle_text: entry.oracle_text,
                cmc: entry.cmc,
                power: entry.power,
                toughness: entry.toughness,
            });
            await cardRepo.save(card);
        }

        const existingSet = await setRepo.findOneBy({code: entry.set});
        if (!existingSet) {
            const set = setRepo.create({
                code: entry.set,
                name: entry.set_name,
                release_date: new Date(entry.released_at),
                set_type: entry.set_type,
            });
            await setRepo.save(set);
        }

        const existingPrinting = await printingRepo.findOneBy({id: entry.id});
        if (!existingPrinting) {
            const printing = printingRepo.create({
                id: entry.id,
                card: {oracle_id: entry.oracle_id},
                set: {code: entry.set},
                collector_number: entry.collector_number,
                rarity: entry.rarity,
                image_uris: entry.image_uris ?? null,
                flavor_text: entry.flavor_text ?? null,
                artist: entry.artist ?? null,
            });
            await printingRepo.save(printing);
        }
        count++;
        console.log(`✅ ${count} cartes traitées...`);
    }

    console.log("Import finished");
    process.exit(0);
}

importCards().then();
