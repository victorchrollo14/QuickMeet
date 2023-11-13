import { Router } from "express";
import { googleAuth } from "../controllers/userRoute";

const userRouter = Router();

userRouter.get("/login", googleAuth);

export { userRouter };
