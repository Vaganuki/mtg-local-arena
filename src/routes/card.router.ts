import {Router} from "express";
import {CardController} from "../controllers/card.controller";

const cardRouter = Router();

cardRouter.get("/:oracle_id", CardController.getCardByID);

export default cardRouter;