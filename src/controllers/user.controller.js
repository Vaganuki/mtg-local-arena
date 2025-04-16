const db = require("../models");
const argon2 = require("argon2");
const userController = {

    addNewUser: async (req, res) => {
        try {
            const { username, email, password, firstname, lastname, birthdate } = req.body;
            const user = await db.users.findOne({
                where: {
                    username,
                    email,
                }
            });
            if (!user) {
                const hash = await argon2.hash(password);
                const data = await db.users.create({
                    username,
                    email,
                    password: hash,
                    firstname,
                    lastname,
                    birthdate,
                });
                return res.status(200).json(data);
            } else {
                return res.status(400).json({error: "Username or email already in use"});
            }
        } catch (err) {
            console.error(err);
            res.status(500).send({error: err})
        }
    }

};

module.exports = userController;