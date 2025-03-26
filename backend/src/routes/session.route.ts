import { Router } from "express";
import { getSessionHandler } from "../controllers/session.controller";

const sessionRouter = Router();

sessionRouter.get("/", getSessionHandler);

export default sessionRouter;
