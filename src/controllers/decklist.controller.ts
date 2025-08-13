import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {Decklist} from "../entity/Decklist";
import {Deck_card} from "../entity/Deck_card";
import {Card_printing} from "../entity/Card_printing";
import {Card} from "../entity/Card";

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

                const printingRepo = AppDataSource.getRepository(Card_printing);

                const printing = await printingRepo.findOne({
                    where: {
                        card: {
                            oracle_id: main_card_id,
                        }
                    }
                });

                const newCard = deckcardRepo.create({
                    is_commander: false,
                    is_sideboard: false,
                    card: main_card_id,
                    decklist: savedDecklist,
                    printing: printing,
                });

                await deckcardRepo.save(newCard);
            }
            res.status(200).json(savedDecklist);
        } catch (e) {
            console.error(e);
            return res.status(500).json({error: "An unexpected error occurred."});
        }

    }

    static async addCardToDecklist(req: Request, res: Response) {
        try {
            const deckCardRepo = AppDataSource.getRepository(Deck_card);
            const printingRepo = AppDataSource.getRepository(Card_printing);
            const decklistRepo = AppDataSource.getRepository(Decklist);

            const {
                deck_id,
                card_id,
                user_id,
                // is_sideboard,
                // is_commander,
                // printing
            } = req.body;

            const decklist = await decklistRepo.findOne({
                where: {
                    id: deck_id,
                }
            });
            if (decklist.user.id === user_id) {

                const printing = await printingRepo.findOne({
                    where: {
                        card: {
                            oracle_id: card_id,
                        }
                    }
                });
                const newAddedCard = deckCardRepo.create({
                    decklist: deck_id,
                    card: card_id,
                    is_sideboard: false,
                    is_commander: false,
                    printing: printing,
                })

                return res.status(200).json(newAddedCard);
            } else{
                return res.status(401).json({error: "Unauthorized user"});
            }
        } catch (e) {
            console.error(e);
            return res.status(500).json("An unexpected error occurred.");
        }
    }

    static async getAllDecklist(req: Request, res: Response) {
        try {
            const decklistRepo = AppDataSource.getRepository(Decklist);
            const data = await decklistRepo.find();
            res.status(200).json(data);
        } catch (e) {
            console.error(e);
            return res.status(500).json('An unexpected error occurred.');
        }
    }

    static async getDeckListByUser(req: Request, res: Response) {
        try {
            const decklistRepo = AppDataSource.getRepository(Decklist);
            const {user_id} = req.params;

            const {page = 1, limit = 20} = req.query;
            const offset = (+page - 1) * +limit;

            const data = await decklistRepo.find({
                take: +limit,
                skip: +offset,
                order: {
                    created_at: 'desc',
                    name: 'ASC'
                },
                where: {
                    user: {
                        id: +user_id,
                    }
                },
                relations: {
                    user: true,
                    game_format: true,
                    deck: {
                        card: true,
                        printing: true,
                    },
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
                    deck: {
                        id: true,
                        card: {
                            name: true,
                            oracle_id: true,
                        },
                        printing: {
                            image_uris: true,
                        },
                    }
                }
            });

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
                    deck: {
                        card: true,
                        printing: true,
                    },
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
                    deck: {
                        id: true,
                        card: {
                            name: true,
                            oracle_id: true,
                        },
                        printing: {
                            image_uris: true,
                        },
                    }
                }
            });

            res.status(200).json(data);
        } catch (e) {
            console.error(e);
            return res.status(500).json('An unexpected error occurred.');
        }
    }
}