import { Router } from "express";
import { googleAuth } from "../services/googleAuth";

const userRouter = Router();

userRouter.get("/login", googleAuth);

export { userRouter };
