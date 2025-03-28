import { motion } from 'framer-motion';
import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface StatCard {
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

interface StatisticsOverviewProps {
  statCards: StatCard[];
  lineChartData: Array<{
    date: string;
    documents: number;
    verified: number;
  }>;
  barChartData: Array<{
    category: string;
    count: number;
  }>;
}

const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({
  statCards,
  lineChartData,
  barChartData,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value.toLocaleString()}
              </p>
              <p
                className={`ml-2 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend === 'up' ? '↑' : '↓'} {Math.abs(stat.change)}%
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Document Verification Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="documents"
                  stroke="#3B82F6"
                  name="Documents"
                />
                <Line
                  type="monotone"
                  dataKey="verified"
                  stroke="#10B981"
                  name="Verified"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Document Categories
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatisticsOverview; 