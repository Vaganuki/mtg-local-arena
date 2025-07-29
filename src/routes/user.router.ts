import {Router} from "express";
import {UserController} from "../controllers/user.controller";

const userRouter = Router();

userRouter.post('/login', UserController.logUser)
    .post('/sign_up', UserController.addNewUser)
    .get('/:id', UserController.getUserById);

export default userRouter;