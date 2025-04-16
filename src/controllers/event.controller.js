import {Op} from "sequelize";
import db from "../models";

const eventController = {
    getAllNext: async (req, res) => {
        try {
            const {page = 1, limit = 20} = req.query;
            const offset = (+page - 1) * limit;

            const events = await db.events.findAll({
                where: {date: {[Op.gte]: new Date()}},
                include: [
                    db.inscriptions,
                    db.formats,
                    db.categories,
                ],
                limit: limit,
                offset: offset,
                order: [['date', 'ASC']],
            });

            if (events) {
                return res.status(200).json(events);
            } else {
                res.status(404).send({error: 'Not Found'});
            }

        } catch (err) {
            console.error(err);
            res.status(500).send({error: err});
        }
    }
}