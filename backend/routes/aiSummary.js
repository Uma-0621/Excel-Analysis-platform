const express = require("express");
const router = express.Router();

// Optional: Uncomment this section to enable OpenAI summary generation
/*
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
*/

router.post("/", async (req, res) => {
  try {
    const { xAxis, yAxis, data } = req.body;

    if (!Array.isArray(data) || data.length === 0 || !xAxis || !yAxis) {
      return res.status(400).json({ summary: "Invalid or incomplete data" });
    }

    // ✅ Basic summary if no AI is integrated
    const sample = data.slice(0, 5).map((row, idx) => `${idx + 1}. ${xAxis}: ${row[xAxis]}, ${yAxis}: ${row[yAxis]}`).join('\n');

    const summary = `📈 Insight based on the first ${data.length} records:\n- X-Axis: ${xAxis}\n- Y-Axis: ${yAxis}\n\n🔍 Sample:\n${sample}`;

    // Optional: Enable this block if using OpenAI
    /*
    const prompt = `You are a data analyst. Analyze the relationship between "${xAxis}" and "${yAxis}" based on the following:\n${sample}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const summary = completion.choices[0].message.content;
    */

    res.json({ summary });
  } catch (err) {
    console.error("AI Summary Error:", err.message);
    res.status(500).json({ summary: "Could not generate summary." });
  }
});

module.exports = router;
