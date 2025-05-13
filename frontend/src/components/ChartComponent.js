import React, { useState, useEffect } from 'react';
import { Chart } from 'chart.js';
import { getColumnData } from '../utils'; // Assuming you have a utility for fetching column data

const ChartComponent = ({ data }) => {
  const [xAxis, setXAxis] = useState('column1');
  const [yAxis, setYAxis] = useState('column2');
  const [chartType, setChartType] = useState('line');
  const [headers, setHeaders] = useState([]);
  
  useEffect(() => {
    if (data && data.length > 0) {
      const keys = Object.keys(data[0]); // Get all column names from the first row
      setHeaders(keys);
      
      if (!keys.includes(xAxis)) setXAxis(keys[0]);
      if (!keys.includes(yAxis)) setYAxis(keys[1] || keys[0]);
    }
  }, [data, xAxis, yAxis]);

  useEffect(() => {
    if (data && data.length > 0) {
      const ctx = document.getElementById('myChart').getContext('2d');
      
      const chartData = {
        labels: getColumnData(data, xAxis),
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data: getColumnData(data, yAxis),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false,
        }]
      };

      // Render the chart when the component mounts or when x/y axis or chart type changes
      new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: xAxis,
              },
              beginAtZero: true,
            },
            y: {
              title: {
                display: true,
                text: yAxis,
              },
              beginAtZero: true,
            },
          },
          plugins: {
            tooltip: {
              enabled: true,
            },
            legend: {
              position: 'top',
            },
          },
        },
      });
    }
  }, [data, xAxis, yAxis, chartType]);

  const handleDownload = (type) => {
    const canvas = document.getElementById('myChart');
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

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">📊 Chart Viewer</h2>

      <div className="flex flex-wrap gap-4 items-center mb-4">
        <div>
          <label className="mr-2 text-sm font-medium">Chart Type:</label>
          <select
            className="border rounded p-1"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            <option value="scatter">Scatter</option>
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <canvas id="myChart" width="400" height="400"></canvas>
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={() => handleDownload('png')}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          📸 Download PNG
        </button>
        <button
          onClick={() => handleDownload('pdf')}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          📄 Download PDF
        </button>
      </div>
    </div>
  );
};

export default ChartComponent;
