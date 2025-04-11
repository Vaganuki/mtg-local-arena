const db = require('../models');
const syncController = {
    sync: (req, res) => {
        try {
            db.sequelize.sync()
                .then();
            res.status(200).send('Db synced successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
}

module.exports = syncController;