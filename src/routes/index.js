const router = require('express').Router();

const syncController = require('../controllers/sync.controller');
const eventRouter = require("./event.router");
const userRouter = require("./user.router");

router.get('/sync', syncController.sync)
    .use('/events', eventRouter)
    .use('/user', userRouter);

module.exports = router;