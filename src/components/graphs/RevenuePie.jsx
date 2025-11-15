import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Revenue', value: 90000, color: '#8884d8' }, // Darker purple
  { name: 'Expenses', value: 23900, color: '#82ca9d' }, // Greenish
];

// From your design:
const designData = [
  { name: 'Revenue', value: 76.1, color: '#4F46E5' }, // Indigo
  { name: 'Expenses', value: 23.9, color: '#A78BFA' }, // Lighter Purple
];

const CustomLegend = (props) => {
  const { payload } = props;
  return (
    <ul className="flex justify-center space-x-6 mt-4">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center">
          <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
          <span className="text-sm text-gray-600">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const RevenueVsExpensePie = ({ data }) => {
  // Calculate data based on the provided monthly data
  const revenue = data.reduce((acc, item) => acc + item.revenue, 0);
  const expenses = data.reduce((acc, item) => acc + item.expenses, 0);
  const total = revenue + expenses;
  
  const chartData = [
    { name: 'Revenue', value: revenue, color: '#4F46E5' },
    { name: 'Expenses', value: expenses, color: '#A78BFA' },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
          paddingAngle={3}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RevenueVsExpensePie;