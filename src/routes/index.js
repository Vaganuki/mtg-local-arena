const router = require('express').Router();

const syncController = require('../controllers/sync.controller');

router.get('/sync', syncController.sync);

module.exports = router;