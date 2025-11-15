import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, Label } from 'recharts';

const data = [
  { name: 'Storage', value: 84.8, color: '#F472B6' }, // Pink
  { name: 'Remaining', value: 15.2, color: '#FDE6F1' }, // Light Pink
];

// Custom Legend to show "Expenses Breakdown"
const CustomLegend = () => (
  <div className="text-center mt-2">
    <p className="text-sm text-gray-500">Expenses Breakdown</p>
  </div>
);

// Custom label in the center
const CustomCenterLabel = () => {
  return (
    <>
      {/* ✨ FIX: Symmetrical Y-coordinates for perfect alignment.
        - "84%" is now the anchor at 50%.
        - "15.2%" is 12% above.
        - "Storage" is 12% below.
      */}
      <text x="50%" y="38%" textAnchor="middle" dominantBaseline="middle" className="text-xs font-semibold text-gray-500">
        15.2%
      </text>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold text-gray-800">
        84%
      </text>
      <text x="50%" y="62%" textAnchor="middle" dominantBaseline="middle" className="text-sm text-gray-500">
        Storage
      </text>
    </>
  );
};

const TotalExpenseDonut = () => {
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
          <Label content={<CustomCenterLabel />} position="center" />
        </Pie>
        <Legend content={<CustomLegend />} verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TotalExpenseDonut;