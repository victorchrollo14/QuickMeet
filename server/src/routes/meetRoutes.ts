import { Router } from "express";
import { createMeet } from "../controllers/meetController";

export const meetRouter = Router();

meetRouter.post("/create", createMeet);
