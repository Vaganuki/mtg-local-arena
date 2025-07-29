import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swagger.json";
import {JwtMiddleware} from "./middlewares/jwt.middleware";

import routes from "./routes/index.router";
const port = process.env.PORT;

import {AppDataSource} from "./data-source"
AppDataSource.initialize().then(async () => {
    // console.log("Here you can set up and run express / fastify / any other framework.")

    app.use(express.json());
    app.use(JwtMiddleware);
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

    app.use(routes);

    app.get("/", (req: express.Request, res: express.Response) => {
        res.status(200).json("hello_world('print');")
    });
    app.listen(port, () => {
        console.log("Server started on port " + port);
    });

}).catch(error => console.log(error));
