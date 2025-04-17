const {Op} = require("sequelize");
const db = require("../models");
const fs = require("fs");
const imageDelete = require('../core/utils');

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
            res.status(500).send({error: "An unexpected error occurred"});
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
            res.status(500).send({error: "An unexpected error occurred"});
        }
    },
    createEvent: async (req, res) => {
        const image = req.file ? req.file.filename : null;
        if (req.user) {
            try {
                const {name, description, places_count, location, id_format, id_category, annulation, date} = req.body;
                const event = await db.events.findOne({
                    where: {
                        name,
                        id_category,
                        date,
                        location,
                    }
                });
                if (!event) {
                    const data = await db.events.create({
                        name,
                        description,
                        places_count,
                        location,
                        id_format,
                        id_category,
                        annulation,
                        image,
                        date,
                        id_creator: req.user.id,
                    });
                    res.status(201).json(data);
                } else {
                    imageDelete(image, req.file.filename);
                    res.status(400).json({error: `This event already exists`});
                }
            } catch (err) {
                imageDelete(image, req.file.filename);
                console.error(err);
                res.status(500).send({error: "An unexpected error occurred"});
            }
        } else {
            imageDelete(image, req.file.filename);
            res.status(401).json({error: `You must be logged in to create an event`});
        }
    },
    updateEvent: async (req, res) => {
        let image = req.file ? req.file.filename : null;
        if (req.user) {
            let event = null
            try {
                event = await db.events.findOne({
                    where: {
                        id: +req.params.id,
                    }
                });
            } catch (err) {
                imageDelete(image, req.file.filename);
                console.error(err);
                res.status(500).send({error: "An unexpected error occurred"});
            }
            try {
                if (event) {
                    if (event.id_creator === req.user.id) {
                        const {
                            name,
                            description,
                            places_count,
                            location,
                            id_format,
                            id_category,
                            annulation,
                            date
                        } = req.body;
                        if (image !== null) {
                            imageDelete(event.image, event.image);
                        } else {
                            image = event.image;
                        }
                        await db.events.update(
                            {
                                name,
                                description,
                                places_count,
                                location,
                                id_format,
                                id_category,
                                annulation,
                                date,
                                image
                            },
                            {
                                where: {id: +req.params.id},
                            });
                        res.status(201).json({update: event});
                    } else {
                        imageDelete(image, req.file.filename);
                        res.status(401).send({error: 'Only the creator of this event can update it'});
                    }
                } else {
                    imageDelete(image, req.file.filename);
                    res.status(404).json({error: `Not Found`});
                }
            } catch (err) {
                imageDelete(image, req.file.filename);
                console.error(err);
                res.status(500).send({error: "An unexpected error occurred"});
            }
        } else {
            imageDelete(image, req.file.filename);
            res.status(401).json({error: `You must be logged in to update an event`});
        }
    }
}

module.exports = eventController;