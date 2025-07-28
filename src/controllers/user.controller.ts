import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

export class UserController {

    static async addNewUser(req: Request, res: Response): Promise<Response> {
        const profileImage = null;
        const userRepo = AppDataSource.getRepository(User);

        const {
            username,
            email,
            firstName,
            lastName,
            password,
            birthdate,
        } = req.body;

        try {
            const existing = await userRepo.findOne({where: [{username}, {email}]});

            if (existing) {
                // if profileImage then delete image (I don't wanna do mutler rn so yeah don't mind me pls;
                return res.status(409).json({error: "User or email already taken"});
            }

            const hashedPassword = await argon2.hash(password);

            const user = userRepo.create({
                username,
                email,
                password: hashedPassword,
                firstName,
                lastName,
                birthdate: new Date(birthdate),
                profileImage,
            });

            const savedUser = await userRepo.save(user);

            return res.status(201).json(savedUser);
        } catch (error) {
            // if profileImage then delete image (I don't wanna do mutler rn so yeah don't mind me pls;
            console.error(error);
            return res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    static async getUserById(req: Request, res: Response): Promise<Response> {
        const userId = parseInt(req.params.id);
        const userRepo = AppDataSource.getRepository(User);

        try {
            const user = await userRepo.findOne({where: {id: userId}});

            if (!user) {
                return res.status(404).json({error: "User not found."});
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    static async updateUser(req: Request, res: Response): Promise<Response> {
        const userId = parseInt(req.params.id);
        const userRepo = AppDataSource.getRepository(User);

        try {
            const user = await userRepo.findOne({where: {id: userId}});
            if (!user) {
                return res.status(404).json({error: "User not found"});
            }

            const {
                username,
                email,
                firstName,
                lastName,
                birthdate,
                password,
            } = req.body;

            //Profile image, you know the drill;

            user.username = username ?? user.username;
            user.email = email ?? user.email;
            user.firstName = firstName ?? user.firstName;
            user.lastName = lastName ?? user.lastName;
            user.birthdate = birthdate ? new Date(birthdate) : user.birthdate;
            user.password = password ?? user.password;

            const updated = await userRepo.save(user);

            return res.status(200).json(updated);
        } catch (error) {
            // if profileImage then delete image (I don't wanna do mutler rn so yeah don't mind me pls;
            console.error(error);
            return res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    static async deleteUser(req: Request, res: Response): Promise<Response> {
    }

    static async logUser(req: Request, res: Response): Promise<Response> {
        const {email, password} = req.body;
        const userRepo = AppDataSource.getRepository(User);

        try {
            const user = await userRepo.findOne({where: {email}});

            if (!user) {
                return res.status(401).json({error: "Invalid Credentials"});
            }

            const passwordMatch = await argon2.verify(user.password, password);

            if (!passwordMatch) {
                return res.status(401).json({error: "Invalid Credentials"});
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
                process.env.JWT_SECRET as string,
                {
                    expiresIn: process.env.JWT_EXPIRES,
                    algorithm: process.env.JWT_ALGORITHM as jwt.Algorithm,
                }
            );

            return res.status(202).json({token});
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: "An unexpected error occurred."});
        }
    }

}