'use client';

import React from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(...registerables);

interface ScatterPlotProps {
  data: {
    x: number;
    y: number;
  }[];
  regressionLine: {
    x: number;
    y: number;
  }[];
  xLabel: string;
  yLabel: string;
  title: string;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data,
  regressionLine,
  xLabel,
  yLabel,
  title,
}) => {
  // Common font settings
  const fontFamily = "'Inter', 'Segoe UI', system-ui, sans-serif";
  const fontSize = 12;
  
  const chartData = {
    datasets: [
      {
        type: 'scatter' as const,
        label: 'Data Points',
        data: data,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(0, 0, 0, 0.8)',
        pointRadius: 5,
        pointHoverRadius: 6,
      },
      {
        type: 'line' as const,
        label: 'Regression Line',
        data: regressionLine,
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1.5,
        pointRadius: 0,
        borderDash: [5, 5],
        fill: false,
        showLine: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: fontFamily,
          size: 12,
        },
        bodyFont: {
          family: fontFamily,
          size: 12,
        },
        callbacks: {
          label: (context: any) => {
            return `(${context.parsed.x}, ${context.parsed.y})`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xLabel,
          font: {
            family: fontFamily,
            size: fontSize,
            weight: '500',
          },
        },
        min: 1.5,
        max: 5.0,
        ticks: {
          stepSize: 0.5,
          font: {
            family: fontFamily,
            size: fontSize,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: true,
        },
      },
      y: {
        title: {
          display: true,
          text: yLabel,
          font: {
            family: fontFamily,
            size: fontSize,
            weight: '500',
          },
        },
        min: 70,
        max: 190,
        ticks: {
          stepSize: 10,
          font: {
            family: fontFamily,
            size: fontSize,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: true,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 p-4 bg-white rounded-lg border border-gray-200">
      <Chart 
        type="scatter" 
        options={options} 
        data={chartData} 
        className="w-full"
      />
      <div className="text-center mt-2 text-sm text-gray-600">
        Equation: y = 233 - 32x
      </div>
    </div>
  );
};

export default ScatterPlot;
