import {Router} from "express";
import {DecklistController} from "../controllers/decklist.controller";

const deck_listRouter = Router();
deck_listRouter.get('', DecklistController.getAllDecklist)
    .get('/recent', DecklistController.getRecentDecklist)
    .get('/details/:deckId', DecklistController.getDecklistDetails)
    .post('/create', DecklistController.createDecklist);

export default deck_listRouter;