const express = require("express");
const router = express.Router();

const { addStock, getReport, getMonthlyStock, getMonthlyIssues, getYearlyStock } = require("../controllers/stockController");

router.post("/", addStock);
router.get("/report", getReport);
router.get("/monthly", getMonthlyStock);
router.get("/yearly", getYearlyStock);

module.exports = router;