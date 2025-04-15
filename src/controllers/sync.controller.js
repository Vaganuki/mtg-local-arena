const db = require('../models/index');
const syncController = {
    sync: async (req, res) => {
        try {
            await db.sequelize.sync();
            res.status(200).send('Db synced successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }
}

module.exports = syncController;