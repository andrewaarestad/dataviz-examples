'use client';

import { MetricData } from "@/types/metric-data";
import { SuccessRateChart } from "./charts/success-rate-chart";
import { TransactionChart } from "./charts/transaction-chart";
import OneDayHourlyHistogramChart from "./charts/one-day-hourly-histogram-chart";
import { FixtureData } from "./data/fixtures";
import HistogramChart from "./charts/histogram-chart";
import OneMonthDailyHistogramChart from "./charts/one-month-daily-histogram-chart";
import ChargebackHeatmapChart from "./charts/chargeback-heatmap-chart";

interface DashboardProps {
  timeRange: [Date, Date];
  onTimeRangeChange?: (range: [Date, Date]) => void;
}
  
const Dashboard = ({ timeRange, onTimeRangeChange }: DashboardProps) => {
// Implementation exercise: 
// 1. Create a responsive grid layout
// 2. Implement efficient rendering of multiple charts
// 3. Add interactive features like zooming and tooltips
// 4. Handle loading and error states gracefully

const metrics = FixtureData;

return (
  <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
    {/* Header */}
    <header className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
        Payment Processing Metrics
      </h1>
      <p className="text-gray-600 mt-2">
        Last 3 months of payment processing performance
      </p>
    </header>

    {/* Grid Layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Success Rate Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Transaction Success Rate
        </h2>
        <div className="h-[300px]">
          <SuccessRateChart data={metrics.transaction_success_rate} />
        </div>
      </div>

      {/* Average Transaction Value Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Average Transaction Value
        </h2>
        <div className="h-[300px]">
          <TransactionChart data={metrics.average_transaction_value} />
        </div>
      </div>

      {/* Transactions Per Hour Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Transactions Per Hour
        </h2>
        <div className="h-[300px]">
        <OneDayHourlyHistogramChart data={metrics.transactions_per_hour} />
        </div>
      </div>

      {/* Authorization Time Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Authorization Time
        </h2>
        <div className="h-[300px]">
        <HistogramChart data={metrics.authorization_time_ms} />
        </div>
      </div>

      {/* Decline Rate Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Decline Rate
        </h2>
        <div className="h-[300px]">
        <OneMonthDailyHistogramChart data={metrics.decline_rate} />
        </div>
      </div>

      {/* Chargeback Rate Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Chargeback Rate
        </h2>
        <div className="h-[300px]">
        <ChargebackHeatmapChart data={metrics.chargeback_rate} />
        </div>
      </div>
    </div>
  </div>
)};

export default Dashboard;