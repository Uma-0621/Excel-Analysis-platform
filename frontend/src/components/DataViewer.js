import React, { useState, useEffect, useRef } from 'react';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const DataViewer = ({ data }) => {
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [showGraph, setShowGraph] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const chartRef = useRef(null);

  const columns = data.length ? Object.keys(data[0]) : [];

  useEffect(() => {
    if (columns.length) {
      setXAxis(columns[0]);
      setYAxis(columns[1] || '');
    }
  }, [columns]);

  const generateChartData = () => {
    const colors = data.map(() =>
      `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
    );

    return {
      labels: data.map(row => row[xAxis]),
      datasets: [
        {
          label: `${yAxis}`,
          data: data.map(row => Number(row[yAxis])),
          backgroundColor: chartType === 'pie' ? colors : chartType === 'bar' ? colors : 'rgba(54, 162, 235, 0.6)',
          borderColor: chartType === 'line' || chartType === 'scatter' ? 'rgba(54, 162, 235, 1)' : colors,
          borderWidth: 1,
        },
      ],
    };
  };

  const handleDownloadPDF = async () => {
    const input = chartRef.current;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight);
    pdf.save(`graph-${xAxis}-vs-${yAxis}.pdf`);
  };

  const handleDownloadPNG = async () => {
    const input = chartRef.current;
    const canvas = await html2canvas(input);
    const link = document.createElement('a');
    link.download = `graph-${xAxis}-vs-${yAxis}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const saveChartToBackend = async () => {
    const payload = {
      title: `${yAxis} vs ${xAxis}`,
      xAxis,
      yAxis,
      chartType,
      data,
    };

    try {
      const res = await axios.post('/api/chart-history', payload);
      console.log('Chart history saved:', res.data);
    } catch (err) {
      console.error('Error saving chart history:', err);
    }
  };

  const fetchAISummary = async () => {
    try {
      const res = await axios.post('/api/ai-summary', {
        tableData: data,
        xAxis,
        yAxis,
      });
      setAiSummary(res.data.summary);
    } catch (err) {
      console.error('AI summary error:', err);
      setAiSummary('Could not generate summary.');
    }
  };

  const handleGenerateGraph = async () => {
    setShowGraph(true);
    await saveChartToBackend();
    await fetchAISummary();
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">📊 Excel Data</h3>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label>X-Axis: </label>
          <select value={xAxis} onChange={(e) => setXAxis(e.target.value)} className="border p-1">
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Y-Axis: </label>
          <select value={yAxis} onChange={(e) => setYAxis(e.target.value)} className="border p-1">
            {columns.map((col) => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Chart Type: </label>
          <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="border p-1">
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
            <option value="scatter">Scatter</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto max-h-64 overflow-y-auto border rounded mb-4">
        <table className="min-w-full text-sm text-left table-auto">
          <thead className="bg-gray-200 sticky top-0">
            <tr>{columns.map((col) => <th key={col} className="p-2">{col}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-b">
                {columns.map((col) => <td key={col} className="p-2">{row[col]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleGenerateGraph}>
          Generate Graph
        </button>

        {showGraph && (
          <>
            <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={handleDownloadPDF}>
              Download as PDF
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleDownloadPNG}>
              Download as PNG
            </button>
          </>
        )}
      </div>

      {showGraph && (
        <div ref={chartRef} className="mt-6 bg-white p-4 rounded shadow">
          <h4 className="text-center font-semibold text-lg mb-2">{`${yAxis} vs ${xAxis}`}</h4>
          {chartType === 'bar' && <Bar data={generateChartData()} />}
          {chartType === 'line' && <Line data={generateChartData()} />}
          {chartType === 'pie' && <Pie data={generateChartData()} />}
          {chartType === 'scatter' && (
            <Scatter
              data={{
                datasets: [{
                  label: `${yAxis}`,
                  data: data.map(row => ({ x: Number(row[xAxis]), y: Number(row[yAxis]) })),
                  backgroundColor: 'rgba(255, 99, 132, 0.6)',
                }],
              }}
            />
          )}
        </div>
      )}

      {aiSummary && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h4 className="font-semibold text-lg mb-2">🧠 AI Insight</h4>
          <p className="text-sm whitespace-pre-wrap">{aiSummary}</p>
        </div>
      )}
    </div>
  );
};

export default DataViewer;
