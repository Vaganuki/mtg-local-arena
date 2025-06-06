const db = require("../models");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const imageDelete = require("../core/utils");

const userController = {
    addNewUser: async (req, res) => {
        const profileImage = req.file ? req.file.filename : null;
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
                    profileImage,
                });
                return res.status(201).json(data);
            } else {
                imageDelete(profileImage);
                return res.status(409).json({error: "Username or email already taken"});
            }
        } catch (err) {
            imageDelete(profileImage);
            console.error(err);
            res.status(500).send({error: "An unexpected error occurred"})
        }
    },
    logUser: async (req, res) => {
        let user = null;
        const {email, password} = req.body;
        try {
            user = await db.users.findOne({
                where: {
                    email
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).send({error: "An unexpected error occurred"});
            return;
        }
        if (user) {
            try {
                if (await argon2.verify(user.password, password)) {
                    const token = jwt.sign({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRE,
                        algorithm: process.env.JWT_ALGORITHM,
                    });
                    res.status(202).json({token});
                } else {
                    res.status(401).send({error: "Invalid Credentials"});
                }
            } catch (err) {
                console.error(err);
                res.status(500).send({error:  "An unexpected error occurred"});
            }
        } else {
            res.status(401).send({error: "Invalid Credentials"});
        }
    },
};

module.exports = userController;