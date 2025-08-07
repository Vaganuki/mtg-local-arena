import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {Decklist} from "../entity/Decklist";

export class DecklistController {
    static async createDecklist(req: Request, res: Response) {
        try {
            const decklistRepo = AppDataSource.getRepository(Decklist);
            const {
                name,
                main_card_id,
                game_format,
            } = req.body;

            const newDecklist = decklistRepo.create({
                name,
                main_card_id,
                game_format,
                created_at: new Date().toISOString(),
                last_updated: new Date().toISOString(),
            });

            const savedDecklist = await decklistRepo.save(newDecklist);

            res.status(200).json(savedDecklist);
        } catch (e) {
            console.error(e);
            return res.status(500).json({error: "An unexpected error occurred."});
        }

    }

}