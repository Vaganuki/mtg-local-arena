import {Router} from "express";
import {UserController} from "../controllers/user.controller";
import {optionalAuth} from "../middlewares/jwt.middleware";

const userRouter = Router();

userRouter.post('/login', UserController.logUser)
    .post('/sign_up', UserController.addNewUser)
    .get('/:id', UserController.getUserById)
    .get('/profile/:username', optionalAuth, UserController.getUserByUsername);

export default userRouter;