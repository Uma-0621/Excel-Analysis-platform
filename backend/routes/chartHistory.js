const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const historyFile = path.join(__dirname, "../data/chartHistory.json");

function ensureHistoryFileExists() {
  if (!fs.existsSync(historyFile)) {
    fs.writeFileSync(historyFile, JSON.stringify([])); // Create an empty array if the file doesn't exist
  }
}

function readHistory() {
  try {
    ensureHistoryFileExists(); // Ensure the file exists before reading
    return JSON.parse(fs.readFileSync(historyFile, "utf-8"));
  } catch (error) {
    console.error("Error reading chart history:", error);
    return [];
  }
}

router.get("/", (req, res) => {
  const history = readHistory();
  res.json(history);
});

router.post("/", (req, res) => {
  const { fileName, chartType, xAxis, yAxis, date } = req.body;
  const history = readHistory();
  const newEntry = { fileName, chartType, xAxis, yAxis, date };
  history.push(newEntry);
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  res.status(201).json({ success: true, entry: newEntry });
});

module.exports = router;
