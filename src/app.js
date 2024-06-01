const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", require('./routers/authRoute'));

module.exports = app;
