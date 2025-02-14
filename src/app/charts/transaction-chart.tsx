'use client';

import { MetricData } from '@/types/metric-data';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';



// Dynamically import Plotly with ssr disabled
const Plot = dynamic(() => import('react-plotly.js'), {
    ssr: false,
    loading: () => <div>Loading chart...</div>
  });

interface TransactionChartProps {

      data: MetricData[];
//   data: {
//     date: string;
//     amount: number;
//   }[];
}

export const TransactionChart: React.FC<TransactionChartProps> = ({ data }) => {
    const chartData = {
      x: data.map(metric => new Date(metric.timestamp)),
      y: data.map(metric => metric.value),
      type: 'scatter',
      mode: 'lines',
      name: data[0]?.name || 'Value',
    };
  
    const layout = {
      title: data[0]?.name || 'Transactions',
      xaxis: {
        title: 'Date',
        tickformat: '%b %d',
      },
      yaxis: {
        title: data[0]?.unit || 'Value',
      },
      height: 300,
      autosize: true,
    };
  
    return (
      <Plot
        data={[chartData as any]}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    );
  };
  