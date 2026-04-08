const express = require("express");
const router = express.Router();

const { issueItem, getIssues } = require("../controllers/issueController");

router.post("/", issueItem);

router.get("/", getIssues);

//router.get("/issues", getMonthlyIssues);

module.exports = router;