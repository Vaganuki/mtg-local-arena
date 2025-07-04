import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "MTG-LOCAL-ARENA",
    synchronize: true, // À retirer en prod
    logging: true,
    entities: [User],
    migrations: [],
    subscribers: [],
})
