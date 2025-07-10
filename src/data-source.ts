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
import {Set} from "./entity/Set";


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "LABO_FIN",
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
        Set,
        Thread,
        User,
    ],
    migrations: [],
    subscribers: [],
})
