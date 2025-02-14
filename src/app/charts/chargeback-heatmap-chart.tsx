'use client';

import { MetricData } from '@/types/metric-data';
import ReactECharts from 'echarts-for-react';
import { subYears, format, parseISO, eachDayOfInterval } from 'date-fns';

interface ChargebackHeatmapChartProps {
  data: MetricData[];
}

const ChargebackHeatmapChart: React.FC<ChargebackHeatmapChartProps> = ({ data }) => {
  // Calculate date range
  const endDate = new Date();
  const startDate = subYears(endDate, 1);

  // Create a map of dates to values
  const dateValueMap = new Map(
    data.map(metric => [
      metric.timestamp.split('T')[0],
      metric.value * 100 // Convert to percentage
    ])
  );

  // Generate all dates in range
  const allDates = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Transform data into format expected by ECharts
  const calendarData = allDates.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return [dateStr, dateValueMap.get(dateStr) || 0];
  });

  const option = {
    tooltip: {
      formatter: (params: any) => {
        return `${params.value[0]}<br/>Chargeback Rate: ${params.value[1].toFixed(2)}%`;
      }
    },
    visualMap: {
      min: 0,
      max: 2,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15',
      inRange: {
        color: ['#d6e685', '#8cc665', '#44a340', '#1e6823']
      }
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ['auto', 15],
      range: [format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')],
      itemStyle: {
        borderWidth: 0.5
      },
      yearLabel: { show: true },
      monthLabel: { show: true },
      dayLabel: { show: true }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: calendarData,
      label: {
        show: false
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3>Chargeback Rate History</h3>
      </div>
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
};

export default ChargebackHeatmapChart;