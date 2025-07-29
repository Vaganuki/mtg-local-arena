import {Router} from "express";
import userRouter from "./user.router";

export const routes = Router();

routes.use("/user", userRouter);

export default routes;