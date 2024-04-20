import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import userRouter from "./routes/user.routes.js";
import orderRouter from "./routes/orders.routes.js";
import itemRouter from "./routes/items.routes.js";
import predefinedRouter from "./routes/predefined.routes.js";

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/orders", itemRouter);
app.use("/api/v1/orders", predefinedRouter);

export { app };
