const express = require("express");
const router = express.Router();

const { addStock, getReport, getMonthlyStock, getMonthlyIssues, getYearlyStock, updateStock, deleteStock } = require("../controllers/stockController");

router.post("/", addStock);
router.get("/report", getReport);
router.get("/monthly", getMonthlyStock);
router.get("/yearly", getYearlyStock);

router.put("/stock/:id", updateStock);
router.delete("/stock/:id", deleteStock);

module.exports = router;