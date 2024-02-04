import express from "express";
import dotenv from "dotenv";
import router from "./router/finance.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(express.json());

app.use(cookieParser());
app.use(helmet());

app.use(router);

app.listen(5000, () => console.log("Server running at port 5000"));
