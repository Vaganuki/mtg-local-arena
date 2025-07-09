import "reflect-metadata"
import {DataSource} from "typeorm"
import {User} from "./entity/User"
import {Game_format} from "./entity/Game_format";
import {Favorite_format} from "./entity/Favorite_format";
import {Thread} from "./entity/Thread";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "MTG-LOCAL-ARENA",
    synchronize: true, // À retirer en prod
    logging: true,
    entities: [
        User,
        Thread,
        Game_format,
        Favorite_format,
    ],
    migrations: [],
    subscribers: [],
})
