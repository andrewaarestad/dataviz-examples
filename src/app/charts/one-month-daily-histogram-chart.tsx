'use client';

import { MetricData } from '@/types/metric-data';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO, getDate } from 'date-fns';

interface OneMonthDailyHistogramChartProps {
  data: MetricData[];
}

const OneMonthDailyHistogramChart: React.FC<OneMonthDailyHistogramChartProps> = ({ data }) => {
  // Initialize arrays for all 31 days
  const dailyAverages = new Array(31).fill(0);
  const dayCounts = new Array(31).fill(0);

  // Group and average data by day of month
  data.forEach(metric => {
    const dayOfMonth = getDate(parseISO(metric.timestamp)) - 1; // 0-based index
    dailyAverages[dayOfMonth] += metric.value;
    dayCounts[dayOfMonth]++;
  });

  // Calculate averages and prepare chart data
  const chartData = Array.from({ length: 31 }, (_, index) => ({
    day: index + 1,
    value: dayCounts[index] > 0 
      ? dailyAverages[index] / dayCounts[index] 
      : 0,
    count: dayCounts[index]
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p>{`Day: ${label}`}</p>
          <p>{`Average: ${payload[0].value.toFixed(2)} ${data[0]?.unit || ''}`}</p>
          <p>{`Sample Count: ${payload[0].payload.count}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 40,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="day"
            label={{ 
              value: 'Day of Month', 
              position: 'bottom',
              offset: 0
            }}
          />
          <YAxis
            label={{ 
              value: data[0]?.unit || 'Value', 
              angle: -90, 
              position: 'insideLeft',
              offset: -5
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="value" 
            fill="#8884d8"
            name={data[0]?.name || 'Value'} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OneMonthDailyHistogramChart;
