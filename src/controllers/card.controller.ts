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

    static async searchCard(req: Request, res: Response) {
        try {
            const {query} = req.params;
            const limit = 20;

            const cardRepo = AppDataSource.getRepository(Card);
            const cards = await cardRepo
                .createQueryBuilder('card')
                .where(`to_tsvector('simple', card.name) @@ plainto_tsquery(:query)`, {query})
                .orderBy(`ts_rank(to_tsvector('simple', card.name), plainto_tsquery(:query))`, 'DESC')
                .take(limit)
                .getMany();

            return res.status(200).json(cards);
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: "An unexpected error occurred."});
        }
    }
}