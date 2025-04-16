const router = require('express').Router();

const syncController = require('../controllers/sync.controller');
const eventRouter = require("./event.router");

router.get('/sync', syncController.sync)
    .use('/events', eventRouter);

module.exports = router;