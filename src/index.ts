import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./swagger.json";
import {AppDataSource} from "./data-source"
// import {User} from "./entity/User"

const port = process.env.PORT || 3000;
const app = express();


AppDataSource.initialize().then(async () => {

    app.use(express.json());

    // console.log("Here you can setup and run express / fastify / any other framework.")

    app.get("/", (req: express.Request, res: express.Response) => {
        res.status(200).json("hello_world('print');")
    })
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    app.listen(port, () => {
        console.log("Server started on port " + port);
    })

}).catch(error => console.log(error));
