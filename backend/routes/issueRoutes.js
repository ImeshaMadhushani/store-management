const express = require("express");
const router = express.Router();

const { issueItem, getIssues, getMonthlyIssues, getYearlyIssues, updateIssue, deleteIssue } = require("../controllers/issueController");

router.post("/", issueItem);

router.get("/", getIssues);

router.get("/monthly", getMonthlyIssues);

router.get("/yearly", getYearlyIssues);

router.put("/:id", updateIssue);
router.delete("/:id", deleteIssue);

module.exports = router;