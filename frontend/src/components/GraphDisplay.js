// src/GraphDisplay.js
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";

function GraphDisplay({ data }) {
  const xData = data.map(item => item['Column1']);  // Replace with your column names
  const yData = data.map(item => item['Column2']);  // Replace with your column names

  const chartData = {
    labels: xData,
    datasets: [
      {
        label: "My Dataset",
        data: yData,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'X Axis Label',  // Change to your X-axis label
        },
      },
      y: {
        title: {
          display: true,
          text: 'Y Axis Label',  // Change to your Y-axis label
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default GraphDisplay;
