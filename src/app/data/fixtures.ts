

import { MetricData } from "@/types/metric-data";


const generateMetricData = (
  name: string,
  startDate: Date,
  endDate: Date,
  baseValue: number,
  volatility: number,
  isInteger: boolean = false
): MetricData[] => {
  const data: MetricData[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Add some random variation to make data look realistic
    const randomFactor = 1 + (Math.random() - 0.5) * volatility;
    let value = baseValue * randomFactor;
    
    // Round to integer if specified
    if (isInteger) {
      value = Math.round(value);
    } else {
      value = Number(value.toFixed(2));
    }
    
    data.push({
      timestamp: new Date(currentDate).toISOString(),
      value,
      name,
    });
    
    // Increment by 1 hour for more granular data
    currentDate.setHours(currentDate.getHours() + 1);
  }
  
  return data;
};

// Generate 3 months of data
const endDate = new Date();
const startDate = new Date(endDate);
startDate.setMonth(endDate.getMonth() - 3);

export const FixtureData = {
  transaction_success_rate: generateMetricData('transaction_success_rate', startDate, endDate, 98, 0.03),
  average_transaction_value: generateMetricData('average_transaction_value', startDate, endDate, 100, 0.5),
  transactions_per_hour: generateMetricData('transactions_per_hour', startDate, endDate, 1000, 0.2, true),
  authorization_time_ms: generateMetricData('authorization_time_ms', startDate, endDate, 500, 0.6),
  decline_rate: generateMetricData('decline_rate', startDate, endDate, 3, 0.6),
  chargeback_rate: generateMetricData('chargeback_rate', startDate, endDate, 0.2, 0.5),
}

// // Generate payment processing relevant metrics
// export const fixtureData: MetricData[] = [
//   // Transaction Success Rate (percentage between 95-100%)
//   ...generateMetricData('transaction_success_rate', startDate, endDate, 98, 0.03),
  
//   // Average Transaction Value (in dollars, varies between $50-150)
//   ...generateMetricData('average_transaction_value', startDate, endDate, 100, 0.5),
  
//   // Transactions Per Hour (integer, varies between 800-1200)
//   ...generateMetricData('transactions_per_hour', startDate, endDate, 1000, 0.2, true),
  
//   // Authorization Time (milliseconds, varies between 200-800ms)
//   ...generateMetricData('authorization_time_ms', startDate, endDate, 500, 0.6),
  
//   // Decline Rate (percentage between 1-5%)
//   ...generateMetricData('decline_rate', startDate, endDate, 3, 0.6),
  
//   // Chargeback Rate (percentage between 0.1-0.3%)
//   ...generateMetricData('chargeback_rate', startDate, endDate, 0.2, 0.5),
// ];
