import express from "express";
import { dbConnect } from "./config/database.config";

const path = require("path");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const matchRouter = require("./routes/match");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/**
 * Predisposizione alla connessione Frontend;
 */
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

/**
 * Connessione al Database MongoDB locale.
 * Database inserito all'interno di un Docker Container accessibile alla porta 27017;
 */
const morgan = require("morgan");
const bodyParser = require("body-parser");

dbConnect();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Dichiarazione rotte relative ai Matches;
 */
app.use("/api/match", matchRouter);
module.exports = app;
