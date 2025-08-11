import {Request, Response} from 'express';
import {AppDataSource} from "../data-source";
import {Game_format} from "../entity/Game_format";

export class Game_formatController {
    static async getAllFormats(req: Request, res: Response) {
        try {
            const gameFormatRepo = AppDataSource.getRepository(Game_format);
            const formats = await gameFormatRepo.find({})

            res.status(200).json(formats);

        } catch (e) {
            console.error(e);
            return res.status(500).json({error: e});
        }
    }
}