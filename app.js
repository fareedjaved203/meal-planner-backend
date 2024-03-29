import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);

export { app };
