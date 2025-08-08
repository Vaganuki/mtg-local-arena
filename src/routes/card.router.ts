import {Router} from "express";
import {CardController} from "../controllers/card.controller";

const cardRouter = Router();

cardRouter.get("/:oracle_id", CardController.getCardByID)
    .get('/search/:query', CardController.searchCard);

export default cardRouter;