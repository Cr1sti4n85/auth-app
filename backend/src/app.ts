import express, { Application } from "express";
import { EnvConfiguration } from "./config/envConfig";
import "./lib/db";

const app: Application = express();

const port = EnvConfiguration().port;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
