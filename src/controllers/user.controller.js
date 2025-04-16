const db = require("../models");
const argon2 = require("argon2");
const userController = {
    addNewUser: async (req, res) => {
        try {
            const {username, email, password, firstname, lastname, birthdate} = req.body;
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
                return res.status(201).json(data);
            } else {
                return res.status(400).json({error: "Username or email already in use"});
            }
        } catch (err) {
            console.error(err);
            res.status(500).send({error: err})
        }
    },
    logUser: async (req, res) => {
        let user = null;
        const {mail, password} = req.body;
        try {
            user = await db.users.findOne({
                where: mail
            });
        } catch (err) {
            console.error(err);
            res.status(500).send({error: err});
            return;
        }
        if (user) {
            try {
                if (await argon2.verify(password, user.password)) {
                    const token = jwt.sign({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRE,
                        algorithm: "HS256",
                    });
                    res.status(202).json({token});
                } else {
                    res.status(401).send({error: "Invalid Credentials"});
                }
            } catch (err) {
                console.error(err);
                res.status(500).send({error: err});
            }
        } else {
            res.status(401).send({error: "Invalid Credentials"});
        }
    },
};

module.exports = userController;