import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  verifyEmailHandler,
  sendPasswordResetHandler,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.get("/logout", logoutHandler);
authRouter.get("/refresh", refreshHandler);
authRouter.get("/email/verify/:code", verifyEmailHandler);
authRouter.post("/password/forgot", sendPasswordResetHandler);

export default authRouter;
