import {Request, Response} from "express";
import {AppDataSource} from "../data-source";
import {User} from "../entity/User";
import {Following} from "../entity/Following";

export class FollowController {
    static async FollowUser(req: Request, res: Response): Promise<Response> {
        try {
            const {followerId, followedId} = req.body;

            const userRepo = AppDataSource.getRepository(User);
            const followRepo = AppDataSource.getRepository(Following);

            const follower = await userRepo.findOne({
                where: {
                    id: followerId
                }
            });
            if (!follower) return res.status(401).json({error: "User not logged in"});

            const followed = await userRepo.findOne({
                where: {
                    id: followedId
                }
            });
            if (!followed) return res.status(404).json({error: "User not found"});

            const alreadyFollowed = await followRepo.findOne({
                where: {
                    follower: followerId,
                    followed_id: followedId,
                }
            });
            if (alreadyFollowed) return res.status(403).json({error: "User already followed"});

            const newFollow = followRepo.create({
                followed_id: followedId,
                follower: followerId,
            })

            const follow = await followRepo.save(newFollow);
            res.status(200).json(follow);

        } catch (e) {
            console.error(e);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    static async UnfollowUser(req: Request, res: Response): Promise<Response> {
        try {
            const {followerId, followedId} = req.body;

            const userRepo = AppDataSource.getRepository(User);
            const followRepo = AppDataSource.getRepository(Following);

            const follower = await userRepo.findOne({
                where: {
                    id: followerId
                }
            });
            if (!follower) return res.status(401).json({error: "User not logged in"});

            const followed = await userRepo.findOne({
                where: {
                    id: followedId
                }
            });
            if (!followed) return res.status(404).json({error: "User not found"});

            const alreadyFollowed = await followRepo.findOne({
                where: {
                    follower: follower,
                    followed_id: followedId,
                }
            });
            if (!alreadyFollowed) return res.status(403).json({error: "User isn't followed"});

            await followRepo.remove(alreadyFollowed);
            res.status(200).json('User successfully unfollowed');
        } catch (e) {
            console.error(e);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    static async GetUserFollower(req: Request, res: Response): Promise<Response> {
        try {
            const {userId} = req.params;

            const userRepo = AppDataSource.getRepository(User);
            const followRepo = AppDataSource.getRepository(Following);

            const user = await userRepo.findOne({
                where: {
                    id: +userId
                }
            });
            if (!user) return res.status(404).json({error: "User not found"});

            const followers = await followRepo.find({
                where: {
                    followed_id: +userId,
                },
                relations: {
                    follower: true
                },
                select: {
                    id: true,
                    followed_id: true,
                    follower: {
                        id: true,
                        username: true,
                        avatar: true,
                    }
                }
            });
            const followingUsers = [];

            for (const follow of followers) {
                const following = {
                    id: follow.follower.id,
                    username: follow.follower.username,
                    avatar: follow.follower.avatar,
                };
                followingUsers.push(following);
            }

            res.status(200).json(followingUsers);
        } catch (e) {
            console.error(e);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    static async GetUserFollowing(req: Request, res: Response): Promise<Response> {
        try {

            const {userId} = req.params;

            const userRepo = AppDataSource.getRepository(User);
            const followRepo = AppDataSource.getRepository(Following);

            const user = await userRepo.findOne({
                where: {
                    id: +userId,
                }
            });
            if (!user) return res.status(404).json({error: "User not found"});

            const followed = await followRepo.find({
                where: {
                    follower: {
                        id: +userId,
                    }
                },
                relations: {
                    follower: true
                },
                select: {
                    id: true,
                    followed_id: true,
                }
            });

            const followedUsers = [];

            for (const follower of followed) {
                const followedUser = await userRepo.findOne({
                    where: {
                        id: follower.followed_id,
                    },
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    }
                });
                if (followedUser) {
                    followedUsers.push(followedUser);
                }
            }

            res.status(200).json(followedUsers);
        } catch (e) {
            console.error(e);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }
}
