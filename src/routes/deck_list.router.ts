import {Router} from "express";
import {DecklistController} from "../controllers/decklist.controller";

const deck_listRouter = Router();
deck_listRouter.get('', DecklistController.getAllDecklist)
    .get('/recent', DecklistController.getRecentDecklist)
    .get('/by_user/:user_id', DecklistController.getDeckListByUser)
    .get('/details/:deckId', DecklistController.getDecklistDetails)
    .post('/addCard', DecklistController.addCardToDecklist)
    .post('/create', DecklistController.createDecklist)
    ;

export default deck_listRouter;