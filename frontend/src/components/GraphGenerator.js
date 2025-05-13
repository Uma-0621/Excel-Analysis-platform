import React, { useEffect, useState } from 'react';
import ChartViewer from './ChartViewer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const GraphGenerator = ({ data, fileName = "Uploaded File" }) => {
  const [aiSummary, setAISummary] = useState("");

  const chartType = "bar";
  const xAxis = data?.[0] ? Object.keys(data[0])[0] : "";
  const yAxis = data?.[0] ? Object.keys(data[0])[1] : "";

  useEffect(() => {
    const saveChartHistory = async () => {
      if (!data || data.length === 0) return;

      try {
        await fetch("/api/chart-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName,
            chartType,
            xAxis,
            yAxis,
            date: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error("Error saving chart history", err);
      }
    };
    saveChartHistory();
  }, [data]);

  const downloadChart = async (format = "png") => {
    const chartArea = document.getElementById("chart-container");
    const canvas = await html2canvas(chartArea);
    const imgData = canvas.toDataURL("image/png");

    if (format === "png") {
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "chart.png";
      link.click();
    } else if (format === "pdf") {
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 180, 160);
      pdf.save("chart.pdf");
    }
  };

  const fetchAISummary = async () => {
    try {
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableData: data }),
      });
      const result = await res.json();
      setAISummary(result.summary || "No insights found.");
    } catch (err) {
      console.error("AI Summary error:", err);
      setAISummary("Failed to fetch summary.");
    }
  };

  // ✅ Moved this return after the hook
  if (!data || data.length === 0) {
    return <p className="text-red-500">No data to display chart.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📈 Graph Generator</h2>
      <div id="chart-container" className="bg-white shadow-md p-4 rounded-lg mb-4">
        <ChartViewer data={data} />
      </div>

      <div className="space-x-2 mb-4">
        <button
          onClick={() => downloadChart("png")}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Download PNG
        </button>
        <button
          onClick={() => downloadChart("pdf")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download PDF
        </button>
        <button
          onClick={fetchAISummary}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Generate AI Summary
        </button>
      </div>

      {aiSummary && (
        <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">📋 AI Summary:</h3>
          <p className="text-sm whitespace-pre-wrap">{aiSummary}</p>
        </div>
      )}
    </div>
  );
};

export default GraphGenerator;
