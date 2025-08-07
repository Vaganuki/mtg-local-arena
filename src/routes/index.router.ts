import {Router} from "express";
import userRouter from "./user.router";
import cardRouter from "./card.router";

export const routes = Router();

routes.use("/user", userRouter)
    .use('/card', cardRouter);

export default routes;