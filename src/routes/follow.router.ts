import {Router} from "express";
import {FollowController} from "../controllers/follow.controller";

const followRouter = Router();
followRouter.get('/following/:userId', FollowController.GetUserFollowing)
    .get('/followers/:userId', FollowController.GetUserFollower)
    .post('/follow', FollowController.FollowUser)
    .post('/unfollow', FollowController.UnfollowUser);

export default followRouter;