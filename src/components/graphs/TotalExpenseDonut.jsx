import React from 'react';
// ✨ FIXED: Added 'Label' to the import list
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, Label } from 'recharts';

const data = [
  { name: 'Storage', value: 84.8, color: '#F472B6' }, // Pink
  { name: 'Remaining', value: 15.2, color: '#FDE6F1' }, // Light Pink
];

// Custom Legend to show "Expenses Breakdown"
const CustomLegend = () => (
// ... (rest of the file is correct) ...
  <div className="text-center mt-2">
    <p className="text-sm text-gray-500">Expenses Breakdown</p>
  </div>
);

// Custom label in the center
const CustomCenterLabel = () => {
// ... (rest of the file is correct) ...
  return (
    <>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xs font-semibold text-gray-500">
        15.2%
      </text>
      <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold text-gray-800">
        84%
      </text>
      <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="text-sm text-gray-500">
        Storage
      </text>
    </>
  );
};

const TotalExpenseDonut = () => {
// ... (rest of the file is correct) ...
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke={entry.color} />
          ))}
          {/* This line will no longer crash */}
          <Label content={<CustomCenterLabel />} position="center" />
        </Pie>
        <Legend content={<CustomLegend />} verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TotalExpenseDonut;