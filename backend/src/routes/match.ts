import express from "express";

const router = express.Router();

const MatchController = require("../controllers/MatchController");

router.get("/retrieve/global-ranking", MatchController.retrieveMatchesListOrderByTime);
router.get("/retrieve", MatchController.retrieveSingleMatchByID);
router.get("/retrieve/ranking", MatchController.retrievePartialRanking);
router.post("/retrieve", MatchController.retrieveSingleMatchByNickname);
router.post("/store", MatchController.storeNewMatch);

module.exports = router;
