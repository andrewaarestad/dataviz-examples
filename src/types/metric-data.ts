export type MetricData = {
  id?: string;
  name: string;
  description?: string;
  unit?: string;
  value: number;
  timestamp: string;
  tags?: string[];
  metadata?: Record<string, string>;
};