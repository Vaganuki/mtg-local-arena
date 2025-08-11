import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {Card} from "../entity/Card";
import {ILike, Not} from "typeorm";

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

    static async searchCard(req: Request, res: Response) {
        try {
            const {query} = req.params;
            const limit = 20;

            const cardRepo = AppDataSource.getRepository(Card);

            const cards = await cardRepo.find({
                where: {name: ILike(`%${query}%`), type_line: Not('Card // Card')},
                take: limit,
                order:{name:'ASC'},
            });

            return res.status(200).json(cards);

        } catch (error) {
            console.error(error);
            return res.status(500).json({error: "An unexpected error occurred."});

        }
    }
}