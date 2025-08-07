import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import {AuthRequest} from "../@types/authRequest.type";

export class UserController {

    static async addNewUser(req: Request, res: Response): Promise<Response> {
        try {
            const avatar = null;
            const userRepo = AppDataSource.getRepository(User);

            const {
                username,
                email,
                firstName,
                lastName,
                password,
                birthdate,
            } = req.body;

            const existing = await userRepo.findOne({where: [{username}, {email}]});

            if (existing) {
                // if profileImage then delete image (I don't wanna do mutler rn so yeah don't mind me pls;
                return res.status(409).json({error: "User or email already taken"});
            }

            const hashedPassword = await argon2.hash(password);
            const createdAt = new Date().toISOString();

            const user = userRepo.create({
                username,
                email,
                password: hashedPassword,
                firstName,
                lastName,
                birthdate: new Date(birthdate),
                avatar,
                createdAt,
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
        try {
            const userId = parseInt(req.params.id);
            const userRepo = AppDataSource.getRepository(User);

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

    static async getUserByUsername(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const {username} = req.params;
            const currentUserId = req.user?.id;
            const userRepo = AppDataSource.getRepository(User);


            const user = await userRepo.findOne({where: {username}});

            if (!user) {
                return res.status(404).json({error: "User not found."});
            }

            const isOwnProfile = user.id === currentUserId;

            if (isOwnProfile) {
                return res.status(200).json({
                    user: {...user},
                    isOwnProfile: true,
                    canEdit: true,
                });
            }

            const publicProfile = {
                user: {
                    username: user.username,
                    colorIdentity: user.colorIdentity,
                    pronouns: user.pronouns,
                    avatar: user.avatar,
                    createdAt: user.createdAt,
                },
                isOwnProfile: false,
                canEdit: false,
            }

            res.status(200).json(publicProfile);
        } catch (err) {
            return res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    static async updateUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = parseInt(req.params.id);
            const userRepo = AppDataSource.getRepository(User);

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
                colorIdentity,
                pronouns,
            } = req.body;

            //Profile image, you know the drill;

            if (username && username !== user.username) {
                const existing = await userRepo.findOne({where: {username}});
                if (existing) return res.status(409).json({error: "Username already taken."});
            }

            if (email && email !== user.email) {
                const existing = await userRepo.findOne({where: {email}});
                if (existing) return res.status(409).json({error: "Email already taken."});
            }

            user.username = username ?? user.username;
            user.email = email ?? user.email;
            user.firstName = firstName ?? user.firstName;
            user.lastName = lastName ?? user.lastName;
            user.birthdate = birthdate ? new Date(birthdate) : user.birthdate;
            user.colorIdentity = colorIdentity ?? user.colorIdentity;
            user.pronouns = pronouns ?? user.pronouns;

            if (password) user.password = await argon2.hash(password);

            const updated = await userRepo.save(user);

            const {password: _, ...userWithoutPassword} = updated;

            return res.status(200).json(userWithoutPassword);

        } catch (error) {
            // if profileImage then delete image (I don't wanna do mutler rn so yeah don't mind me pls;
            console.error(error);
            return res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    static async deleteUser(req: Request, res: Response): Promise<Response> {

        try {
            const userId = parseInt(req.params.id);
            const userRepo = AppDataSource.getRepository(User);

            const user = await userRepo.findOne({where: {id: userId}});

            if (!user) {
                return res.status(404).json({error: "User not found."});
            }

            //DELETE THE PROFILE PIC

            await userRepo.remove(user);

            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: "An unexpected error occurred."});
        }

    }

    static async logUser(req: Request, res: Response): Promise<Response> {

        try {
            const {email, password} = req.body;
            const userRepo = AppDataSource.getRepository(User);
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
                process.env.JWT_SECRET,
                {
                    expiresIn: '1d',
                    algorithm: 'HS256',
                }
            );

            return res.status(202).json({token});
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: "An unexpected error occurred."});
        }
    }

}