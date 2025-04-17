const eventRouter = require("express").Router();
const eventController = require("../controllers/event.controller");
const JwtMiddleware = require("../middlewares/jwt.middleware");
const upload = require('../middlewares/multer.middleware');

eventRouter.get('/', eventController.getAllNext)
    .get('/all' , eventController.getAllEvents)
    .get('/:id', eventController.getById)
    .put('/:id/update', JwtMiddleware, upload.single('image'), eventController.updateEvent)
    .post('/new', JwtMiddleware, upload.single('image'),eventController.createEvent)
;

module.exports = eventRouter;