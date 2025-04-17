const eventRouter = require("express").Router();
const eventController = require("../controllers/event.controller");

eventRouter.get('/', eventController.getAllNext)
    .get('/all' , eventController.getAllEvents)
    .get('/:id', eventController.getById)
    .post('/new', eventController.createEvent)
;

module.exports = eventRouter;