import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {Decklist} from "../entity/Decklist";
import {Deck_card} from "../entity/Deck_card";

export class DecklistController {
    static async createDecklist(req: Request, res: Response) {
        try {
            const decklistRepo = AppDataSource.getRepository(Decklist);
            const {
                name,
                main_card_id,
                game_format,
                user_id
            } = req.body;

            const newDecklist = decklistRepo.create({
                name,
                main_card_id,
                game_format,
                user: user_id,
                created_at: new Date().toISOString(),
                last_updated: new Date().toISOString(),
            });

            const savedDecklist = await decklistRepo.save(newDecklist);

            if (main_card_id) {
                const deckcardRepo = AppDataSource.getRepository(Deck_card);
                const newCard = deckcardRepo.create({
                    is_commander: false,
                    is_sideboard: false,
                    card: main_card_id,
                    decklist: savedDecklist
                });

                await deckcardRepo.save(newCard);
            }
            res.status(200).json(savedDecklist);
        } catch (e) {
            console.error(e);
            return res.status(500).json({error: "An unexpected error occurred."});
        }

    }

    static async getAllDecklist(req: Request, res: Response) {
        try {
            const decklistRepo = AppDataSource.getRepository(Decklist);
            const data = await decklistRepo.find();
            console.log(data);

            res.status(200).json(data);
        } catch (e) {
            console.error(e);
            return res.status(500).json('An unexpected error occurred.');
        }
    }

    static async getDecklistDetails(req: Request, res: Response) {
        try {
            const decklistRepo = AppDataSource.getRepository(Decklist);
            const deckCardsRepo = AppDataSource.getRepository(Deck_card)
            const {deckId} = req.params;

            const deckList = await decklistRepo.find({
                where: {
                    id: +deckId,
                },
                relations: {
                    user: true,
                    game_format: true,
                },
                select: {
                    id: true,
                    name: true,
                    main_card_id: true,
                    created_at: true,
                    last_updated: true,
                    user: {
                        username: true,
                    },
                    game_format: {
                        name: true,
                    },
                }
            });

            if (!deckList) return res.status(404).json({error: "Decklist not found"});

            const deck = await deckCardsRepo.find({
                where: {
                    decklist: {
                        id: +deckId
                    },
                },
                relations: {
                    card: true,
                }
            })

            const response = {
                decklist: deckList,
                cards: deck
            };

            res.status(200).json(response);
        } catch (e) {
            console.error(e);
            return res.status(500).json('An unexpected error occurred.');
        }
    }

    static async getRecentDecklist(req: Request, res: Response) {
        try {
            const {page = 1, limit = 20} = req.query;
            const offset = (+page - 1) * +limit;

            const decklistRepo = AppDataSource.getRepository(Decklist);

            const data = await decklistRepo.find({
                take: +limit,
                skip: +offset,
                order: {
                    created_at: 'desc',
                    name: 'ASC'
                },
                relations: {
                    user: true,
                    game_format: true,
                },
                select: {
                    id: true,
                    name: true,
                    main_card_id: true,
                    created_at: true,
                    last_updated: true,
                    user: {
                        username: true,
                    },
                    game_format: {
                        name: true,
                    },
                }
            });

            res.status(200).json(data);
        } catch (e) {
            console.error(e);
            return res.status(500).json('An unexpected error occurred.');
        }
    }
}