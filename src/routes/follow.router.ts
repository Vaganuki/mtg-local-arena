import {Router} from "express";
import {FollowController} from "../controllers/follow.controller";

const followRouter = Router();
followRouter
    .get('/followers/:id', FollowController.GetUserFollower)
    .post('/follow', FollowController.FollowUser)
    .post('/unfollow', FollowController.UnfollowUser);

export default followRouter;