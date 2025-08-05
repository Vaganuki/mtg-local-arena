import {Router} from "express";
import {UserController} from "../controllers/user.controller";
import {checkProfileOwnership, optionalAuth} from "../middlewares/jwt.middleware";

const userRouter = Router();

userRouter.post('/login', UserController.logUser)
    .post('/sign_up', UserController.addNewUser)
    .get('/:id', UserController.getUserById)
    .get('/profile/:username', optionalAuth, UserController.getUserByUsername)
    .put('/:id',checkProfileOwnership, UserController.updateUser);

export default userRouter;