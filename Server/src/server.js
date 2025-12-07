import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import main from "./config/db.js";           
import redisClient from "./config/redis.js";  

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const InitializeConnection = async () => {
  try {
    await Promise.all([main(), redisClient.connect()]);
    console.log("DB connected successfully.");

    app.listen(process.env.PORT, () => {
      console.log("Listening at PORT", process.env.PORT);
    });

  } catch (error) {
    console.log(error.message);
  }
};

InitializeConnection();
