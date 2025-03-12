import express, { Application } from "express";
import cors from "cors";
import "dotenv/config";
import "./lib/db";
import { PORT, APP_ORIGIN } from "./config/envConfig";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";

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
app.use(errorHandler);

const port = PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
