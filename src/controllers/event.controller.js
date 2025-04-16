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
                    db.categories,
                    db.formats,
                    db.inscriptions,
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
    },
    getAllEvents: async (req, res) => {
        try {
            const {id_category, id_format, date, searchQuery} = req.query;
            const filters = {};

            if (id_category) {
                filters.category_id = id_category;
            }
            if (id_format) {
                filters.format = id_format;
            }
            if (date) {
                filters.date = date;
            }
            if (searchQuery) {
                filters[Op.or] = [
                    {name: {[Op.iLike]: `%${searchQuery}%`}},
                    {description: {[Op.iLike]: `%${searchQuery}%`}},
                ]
            }
            const events = await db.events.findAll({
                where: filters,
                include: [
                    db.categories,
                    db.formats,
                    db.inscriptions,
                ],
                order: [['date', 'ASC']],
            });
            return res.status(200).json(events);
        } catch (err) {
            console.error(err);
            res.status(500).send({error: err});
        }
    },
    getById: async (req, res) => {
        try {
            const id = +req.params.id;
            const event = await db.events.findOne({
                where: {id},
                include: [
                    db.categories,
                    db.formats,
                    db.inscriptions,
                ]
            });
            if (event) {
                return res.status(200).json(event);
            } else {
                res.status(404).send({error: 'Not Found'});
            }
        } catch (err) {
            console.error(err);
            res.status(500).send({error: err});
        }
    }
}