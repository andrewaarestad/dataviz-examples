'use client';

import { MetricData } from '@/types/metric-data';
import {
  VictoryChart,
  VictoryHistogram,
  VictoryAxis,
  VictoryTooltip,
  VictoryLabel,
  VictoryContainer
} from 'victory';

interface HistogramChartProps {
  data: MetricData[];
  title?: string;
}

const HistogramChart: React.FC<HistogramChartProps> = ({ 
  data,
  title = 'Distribution'
}) => {
  // Transform MetricData to format expected by VictoryHistogram
  const chartData = data.map(metric => ({ x: metric.value }));

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <VictoryChart
        domainPadding={10}
        containerComponent={
          <VictoryContainer 
            style={{
              touchAction: 'auto'
            }}
          />
        }
      >
        <VictoryLabel
          text={title}
          x={225}
          y={30}
          textAnchor="middle"
        />
        
        <VictoryHistogram
          style={{
            data: {
              fill: "rgba(75, 192, 192, 0.5)",
              stroke: "rgba(75, 192, 192, 1)",
              strokeWidth: 1
            }
          }}
          data={chartData}
          bins={Math.ceil(Math.sqrt(data.length))} // Sturges' formula
          labelComponent={
            <VictoryTooltip
              flyoutStyle={{
                stroke: "#756f6a",
                fill: "white"
              }}
              style={{ fontSize: 10 }}
              cornerRadius={5}
              pointerLength={10}
              flyoutPadding={{ top: 5, bottom: 5, left: 10, right: 10 }}
              constrainToVisibleArea
            />
          }
        />

        <VictoryAxis
          label="Value"
          style={{
            axisLabel: { padding: 30 }
          }}
        />
        <VictoryAxis
          dependentAxis
          label="Frequency"
          style={{
            axisLabel: { padding: 40 }
          }}
        />
      </VictoryChart>
    </div>
  );
};

export default HistogramChart;
