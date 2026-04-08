const express = require("express");
const router = express.Router();

const { issueItem, getIssues, getMonthlyIssues, getYearlyIssues } = require("../controllers/issueController");

router.post("/", issueItem);

router.get("/", getIssues);

router.get("/monthly", getMonthlyIssues);

router.get("/yearly", getYearlyIssues);

module.exports = router;