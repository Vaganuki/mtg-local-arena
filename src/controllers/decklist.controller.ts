import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {Decklist} from "../entity/Decklist";
import {Deck_card} from "../entity/Deck_card";
import {Card_printing} from "../entity/Card_printing";
import {User} from "../entity/User";

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
            console.log(req.body);
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
                },
                relations: {
                    user: true,
                }
            });

            if (!decklist) {
                res.status(404).json({error: "No decklist found"});
            }
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


                const savedCard = await deckCardRepo.save(newAddedCard);
                decklist.last_updated = new Date();
                await decklistRepo.save(decklist);
                return res.status(200).json(savedCard);
            } else {
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

            const {sortBy = 'created', order = 'DESC', page = 1, limit = 20} = req.query;
            const offset = (+page - 1) * +limit;

            const validSortOptions = ['created', 'updated', 'name'];
            const validOrderOptions = ['ASC', 'DESC'];

            const sortOption = validSortOptions.includes(sortBy as string) ? sortBy : 'created';
            const orderOption = validOrderOptions.includes((order as string)?.toUpperCase()) ? (order as string).toUpperCase() as 'ASC' | 'DESC' : 'DESC';

            const sortFieldMap = {
                'created': 'created_at',
                'updated': 'last_updated',
                'name': 'name',
            };

            const orderByField = sortFieldMap[sortOption as keyof typeof sortFieldMap];

            const orderConfig = {
                [orderByField]: orderOption,
            }

            if (sortOption !== 'name'){
                orderConfig.name = 'ASC'
            } else if (sortOption === 'name'){
                orderConfig.created_at = 'DESC'
            }

            const data = await decklistRepo.find({
                take: +limit,
                skip: +offset,
                order: orderConfig,
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
                    printing: true,
                },
                select: {
                    printing: {
                        image_uris: true,
                    }
                }
            })

            const response = {
                id: deckList[0].id,
                name: deckList[0].name,
                main_card_id: deckList[0].main_card_id,
                created_at: deckList[0].created_at,
                last_updated: deckList[0].last_updated,
                user: {
                    username: deckList[0].user.username,
                },
                game_format: {
                    name: deckList[0].game_format.name,
                },
                cards: deck,
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

    static async getLatestDecklistFromFollow(req: Request, res: Response) {
        try {
            const decklistRepo = AppDataSource.getRepository(Decklist);
            const userRepo = AppDataSource.getRepository(User);

            const {userID} = req.params;

            const user = await userRepo.find({
                where: {
                    id: +userID,
                }
            });
            if (!user) return res.status(404).json('User not found');

            const {sortBy = 'created', order = 'DESC', page = 1, limit = 20} = req.query;
            const offset = (+page - 1) * +limit;

            const validSortOptions = ['created', 'updated', 'name'];
            const validOrderOptions = ['ASC', 'DESC'];

            const sortOption = validSortOptions.includes(sortBy as string) ? sortBy : 'created';
            const orderOption = validOrderOptions.includes((order as string)?.toUpperCase()) ? (order as string).toUpperCase() as 'ASC' | 'DESC' : 'DESC';

            const sortFieldMap = {
                'created': 'decklist.created_at',
                'updated': 'decklist.last_updated',
                'name': 'decklist.name',
            };

            const orderByField = sortFieldMap[sortOption as keyof typeof sortFieldMap];

            const latestDecklist = await decklistRepo
                .createQueryBuilder('decklist')
                .leftJoinAndSelect('decklist.user', 'user')
                .leftJoinAndSelect('decklist.game_format', 'game_format')
                .innerJoin('following', 'f', 'f.followed_id = decklist.userId')
                .innerJoin('user', 'follower', 'f.followed_id = follower.id')
                .where('follower.id = :userID', {userID: userID})
                .orderBy(orderByField, orderOption)
                .take(+limit)
                .skip(+offset)
                .getMany();

            return res.status(200).json(latestDecklist);
        } catch (e) {
            console.error(e);
            return res.status(500).json('An unexpected error occurred.');
        }
    }
}