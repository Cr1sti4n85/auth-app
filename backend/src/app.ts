import express, { Application } from "express";
import "dotenv/config";
import "./lib/db";
import { PORT } from "./config/envConfig";

const app: Application = express();

const port = PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
