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
                    follower: follower,
                    followed_id: followedId,
                }
            });
            if (alreadyFollowed) return res.status(403).json({error: "User already followed"});

            const newFollow = followRepo.create({
                followed_id: followedId,
                follower: follower,
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

            await followRepo.delete(alreadyFollowed);
            res.status(200).json('User successfully unfollowed');
        } catch (e) {
            console.error(e);
            res.status(500).json({error: "An unexpected error occurred."});
        }
    }

    static async GetUserFollower(req: Request, res: Response): Promise<Response> {
        try{
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
                }
            })

            res.status(200).json(followers);
        } catch (e) {
            console.error(e);
            res.status(500).json({error: "An unexpected error occurred."});
        }


    }
}
