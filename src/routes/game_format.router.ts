import {Router} from "express";
import {Game_formatController} from "../controllers/game_format.controller";

const game_formatRouter = Router();

game_formatRouter.get('/getAll', Game_formatController.getAllFormats);

export default game_formatRouter;