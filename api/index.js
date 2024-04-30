import express from "express";
import dotenv from "dotenv";
import connectDB from "../database/connection.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import userRouter from "../routes/user.routes.js";
import orderRouter from "../routes/orders.routes.js";
import itemRouter from "../routes/items.routes.js";
import predefinedRouter from "../routes/predefined.routes.js";

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

const whitelist = ["*"];

app.use((req, res, next) => {
  const origin = req.get("referer");
  const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
  if (isWhitelisted) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,Content-Type,Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
  }
  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});

const setContext = (req, res, next) => {
  if (!req.context) req.context = {};
  next();
};
app.use(setContext);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/predefined", predefinedRouter);

dotenv.config({
  path: "../.env",
});

app.get("/hello", (req, res) => {
  res.send("Hello World");
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

module.exports = app;
