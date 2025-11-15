import React from 'react';
import { MoreHorizontal } from 'lucide-react'; // Changed from LayoutGrid to match design

// This is a wrapper component to give all charts the same style and header
const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6 h-[320px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {/* Changed icon to match the "three dots" in your design */}
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={18} />
        </button>
      </div>
      {/* Set a fixed height for the chart container */}
      <div className="h-[240px]">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;