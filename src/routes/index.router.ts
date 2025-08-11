import {Router} from "express";
import userRouter from "./user.router";
import cardRouter from "./card.router";
import game_formatRouter from "./game_format.router";

export const routes = Router();

routes.use("/user", userRouter)
    .use('/card', cardRouter)
    .use('/game_format', game_formatRouter);

export default routes;