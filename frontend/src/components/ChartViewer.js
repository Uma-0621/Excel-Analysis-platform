import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx'; // Import SheetJS for Excel Parsing

const ChartViewer = ({ data }) => {
  const [chartType, setChartType] = useState('Bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [headers, setHeaders] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const chartRef = useRef();

  // Excel File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryString = event.target.result;
        const wb = XLSX.read(binaryString, { type: 'binary' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setExcelData(jsonData);
      };
      reader.readAsBinaryString(file);
    }
  };

  // Dynamic Header and Axis Selection
  useEffect(() => {
    if (excelData && excelData.length > 0) {
      const keys = Object.keys(excelData[0]).filter(k => k); // Filter out undefined or empty columns
      setHeaders(keys);
      if (!keys.includes(xAxis)) setXAxis(keys[0]);
      if (!keys.includes(yAxis)) setYAxis(keys[1] || keys[0]);
    }
  }, [excelData]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  // Download Functionality for PNG/PDF
  const handleDownload = async (type) => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');

    if (type === 'png') {
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = imgData;
      link.click();
    } else if (type === 'pdf') {
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 180, 100);
      pdf.save('chart.pdf');
    }
  };

  // Graph Rendering Logic
  const renderChart = () => {
    const chartData = excelData.map(item => ({
      [xAxis]: item[xAxis],
      [yAxis]: parseFloat(item[yAxis]) || 0
    }));

    switch (chartType) {
      case 'Line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey={yAxis} stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'Pie':
        return (
          <PieChart width={280} height={280}>
            <Pie
              data={chartData}
              dataKey={yAxis}
              nameKey={xAxis}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'Scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey={xAxis} name={xAxis} />
              <YAxis type="number" dataKey={yAxis} name={yAxis} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={chartData} fill="#ef4444" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yAxis} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">📊 Chart Viewer</h2>

      {/* File Upload Section */}
      <div className="mb-4">
        <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
      </div>

      {/* Axis and Chart Type Selection */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div>
          <label className="mr-2 text-sm font-medium">Chart Type:</label>
          <select
            className="border rounded p-1"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="Bar">Bar</option>
            <option value="Line">Line</option>
            <option value="Pie">Pie</option>
            <option value="Scatter">Scatter</option>
          </select>
        </div>

        <div>
          <label className="mr-2 text-sm font-medium">X-Axis:</label>
          <select
            className="border rounded p-1"
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
          >
            {headers.map((header, i) => (
              <option key={i} value={header}>{header}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 text-sm font-medium">Y-Axis:</label>
          <select
            className="border rounded p-1"
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
          >
            {headers.map((header, i) => (
              <option key={i} value={header}>{header}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Container */}
      <div ref={chartRef} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        {renderChart()}
      </div>

      {/* Download Buttons */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => handleDownload('png')}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          📸 Download PNG
        </button>
        <button
          onClick={() => handleDownload('pdf')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          📄 Download PDF
        </button>
      </div>
    </div>
  );
};

export default ChartViewer;
