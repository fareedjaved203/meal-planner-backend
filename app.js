require("dotenv").config({ path: "./.env" });
const express = require("express");
const { PORT } = require("./constants");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");

require("./config/db");

const errorMiddleware = require("./middlewares/error");

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

const user = require("./routes/userRoute");

app.use("/api/v1", user);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
