import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {Card} from "../entity/Card";

export class CardController {

    static async getCardByID(req: Request, res: Response) {
        const {oracle_id} = req.params;
        const cardRepo = AppDataSource.getRepository(Card);

        const card = await cardRepo.findOne({
            where: {oracle_id: oracle_id}
        });

        if (!card) res.status(404).json({error: "No Card Found."});

        return res.status(200).json(card);
    }
}