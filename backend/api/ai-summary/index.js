const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { data, xAxis, yAxis } = req.body;

  if (!data || !xAxis || !yAxis) {
    return res.status(400).json({ summary: "❌ Missing data or axis fields." });
  }

  const rowCount = data.length;
  const columnNames = data.length ? Object.keys(data[0]).join(", ") : "No columns";

  const summary = `🧠 AI Summary: You uploaded ${rowCount} rows. Analyzing "${yAxis}" vs "${xAxis}". Columns in data: ${columnNames}.`;

  res.json({ summary });
});

module.exports = router;
