import "reflect-metadata"
import {DataSource} from "typeorm"
import {User} from "./entity/User"
import {Game_format} from "./entity/Game_format";
import {Favorite_format} from "./entity/Favorite_format";
import {Thread} from "./entity/Thread";
import {Card} from "./entity/Card";
import {Card_printing} from "./entity/Card_printing";
import {Decklist} from "./entity/Decklist";
import {Event} from "./entity/Event";
import {Category} from "./entity/Category";
import {Deck_card} from "./entity/Deck_card";
import {Comment} from "./entity/Comment";
import {Participation} from "./entity/Participation";
import {cardSet} from "./entity/CardSet";
import {Following} from "./entity/Following";


export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // À retirer en prod
    logging: true,
    entities: [
        Card,
        Card_printing,
        Category,
        Comment,
        Deck_card,
        Decklist,
        Event,
        Favorite_format,
        Game_format,
        Participation,
        cardSet,
        Thread,
        User,
        Following,
    ],
    migrations: [],
    subscribers: [],
})
