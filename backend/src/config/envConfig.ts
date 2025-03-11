import { config } from "dotenv";

config();

const { PORT: port = 4000, MONGO_URI: mongoUri } = process.env;

export const EnvConfiguration = () => ({
  port,
  mongoUri,
});
