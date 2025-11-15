import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const TableCard = ({ title, children }) => {
  // This state will be used to toggle between Daily/Monthly
  // For now, it's just visual.
  const [timeframe, setTimeframe] = React.useState('Daily');

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center space-x-2">
          {/* Daily/Monthly toggle */}
          <button 
            className={`text-sm font-medium ${timeframe === 'Daily' ? 'text-purple-600' : 'text-gray-500'}`}
            onClick={() => setTimeframe('Daily')}
          >
            Daily
          </button>
          <button 
            className={`text-sm font-medium ${timeframe === 'Monthly' ? 'text-purple-600' : 'text-gray-500'}`}
            onClick={() => setTimeframe('Monthly')}
          >
            Monthly
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {children}
      </div>
    </div>
  );
};

export default TableCard;