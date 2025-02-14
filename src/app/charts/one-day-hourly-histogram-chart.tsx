'use client';
import React from 'react';

import { MetricData } from '@/types/metric-data';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format, parseISO, getHours } from 'date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface OneDayHourlyHistogramChartProps {
  data: MetricData[];
}

const OneDayHourlyHistogramChart: React.FC<OneDayHourlyHistogramChartProps> = ({ data }) => {
  // Initialize array for all 24 hours
  const hourlyAverages = new Array(24).fill(0);
  const hourCounts = new Array(24).fill(0);

  // Group and average data by hour
  data.forEach(metric => {
    const hour = getHours(parseISO(metric.timestamp));
    hourlyAverages[hour] += metric.value;
    hourCounts[hour]++;
  });

  // Calculate averages
  for (let i = 0; i < 24; i++) {
    hourlyAverages[i] = hourCounts[i] > 0 
      ? hourlyAverages[i] / hourCounts[i] 
      : 0;
  }

  const chartData = {
    labels: Array.from({ length: 24 }, (_, i) => 
      format(new Date().setHours(i, 0, 0, 0), 'ha')
    ),
    datasets: [
      {
        label: data[0]?.name || 'Hourly Average',
        data: hourlyAverages,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Average Transactions by Hour of Day',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `Average: ${value.toFixed(2)} ${data[0]?.unit || ''}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hour of Day',
        },
      },
      y: {
        title: {
          display: true,
          text: data[0]?.unit || 'Value',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default OneDayHourlyHistogramChart;