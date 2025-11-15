import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Label } from 'recharts';

// Custom Tooltip to show 42.8%
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // This logic is just for the mockup to show 42.8%
    // In reality, you'd format payload[0].value
    return (
      <div className="bg-gray-900 text-white p-2 rounded shadow-lg">
        <p className="font-bold text-lg">42.8%</p>
        <p className="text-sm">{label}</p>
      </div>
    );
  }
  return null;
};

const MarketingSpendArea = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorMarketing" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="marketingSpend" 
          stroke="#8884d8" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorMarketing)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MarketingSpendArea;