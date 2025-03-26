import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import "./lib/db";
import { PORT, APP_ORIGIN } from "./config/envConfig";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import authRouter from "./routes/auth.route";
import authenticate from "./middleware/authenticate";
import userRouter from "./routes/user.route";
import sessionRouter from "./routes/session.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/auth", authRouter);

app.use("/user", authenticate, userRouter);
app.use("/sessions", authenticate, sessionRouter);

app.use(errorHandler);

const port = PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
