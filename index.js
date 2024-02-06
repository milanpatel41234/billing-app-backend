const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");

const db = require("./models/db");
const authRouter = require("./routes/authRoutes");


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use("/user", authRouter);

db.sequelize.sync();
app.listen(5000);
