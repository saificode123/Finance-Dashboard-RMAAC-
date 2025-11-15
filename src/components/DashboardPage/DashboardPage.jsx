import React, { useState, useMemo } from 'react';
import { Home, ChevronRight, Calendar, BarChart, PieChart, ShoppingBag, User } from 'lucide-react';

import StatCard from '../statCard/StatCard.jsx';
import ChartCard from '../graphs/ChartCard.jsx';
import TableCard from '../graphs/TableCard.jsx';

// Data Source
import { 
  MONTH_KEYS, 
  MOCK_FINANCIAL_DATA, 
  MOCK_SEGMENT_FLUCTUATION, 
  MOCK_VARIANCE_ALERT 
} from '../dummydata/DummyData.jsx';

// Chart Components (from files you provided)
import RevenueVsExpensePie from '../graphs/RevenuePie.jsx'; 
import MarketingSpendArea from '../graphs/MarketingArea.jsx'; 
import CostSegmentArea from '../graphs/CostSegmentArea.jsx'; 
import TotalExpenseDonut from '../graphs/TotalExpenseDonut.jsx';

// Helper to format currency
const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
};

// --- Main Dashboard Page Component ---
const DashboardPage = () => {
  // --- 1. State for Date Filter ---
  // Default to the last 6 months of available data
  const defaultStartDate = MONTH_KEYS[Math.max(0, MONTH_KEYS.length - 6)].key;
  const defaultEndDate = MONTH_KEYS[MONTH_KEYS.length - 1].key;
  
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // --- 2. Data Processing ---
  // This 'useMemo' hook will re-run ONLY when the filter dates change.
  // This is where you would make your API call in the future.
  const filteredData = useMemo(() => {
    // This is dynamic page tracking: the data filters based on state.
    return MOCK_FINANCIAL_DATA.filter(
      d => d.monthKey >= startDate && d.monthKey <= endDate
    );
  }, [startDate, endDate]);

  // Calculate aggregated stats for the KPI cards
  const stats = useMemo(() => {
    const totalRevenue = filteredData.reduce((acc, item) => acc + item.revenue, 0);
    const totalExpenses = filteredData.reduce((acc, item) => acc + item.expenses, 0);
    const netProfit = totalRevenue - totalExpenses;
    const mktgRevenue = totalRevenue > 0 ? (filteredData.reduce((acc, item) => acc + item.marketingSpend, 0) / totalRevenue) : 0;
    
    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      mktgRevenue,
    };
  }, [filteredData]);

  // --- 3. Helper to render table rows ---
  const renderTableRow = (item) => (
    <tr key={item.segment} className="border-b border-gray-100 last:border-b-0">
      <td className="py-3 px-2 text-sm text-gray-700">{item.segment}</td>
      <td className="py-3 px-2 text-sm text-gray-500">{formatCurrency(item.totalCost || item.currentCost)}</td>
      <td className="py-3 px-2 text-sm text-gray-500">{formatCurrency(item.avgMonthlyCost || item.mom)}</td>
      {/* Only show fluctuation for the first table */}
      {item.fluctuation && (
        <td className="py-3 px-2 text-sm text-gray-500">{formatCurrency(item.fluctuation)}</td>
      )}
    </tr>
  );

  // --- 4. Render Component ---
  return (
    <div className="space-y-6">
      <h1>Test Dashboard</h1>
      
      {/* 1. Breadcrumb and Date Picker */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <nav className="flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
          <Home size={16} className="mr-2 text-gray-400" />
          <span className="font-medium text-gray-700">Dashboard</span>
          <ChevronRight size={16} className="mx-1" />
          <span>Summary</span>
        </nav>
        
        {/* Date Filter Selection */}
        <div className="flex items-center space-x-2 text-sm">
          <Calendar size={16} className="mr-1 text-gray-500" />
          <select 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            {MONTH_KEYS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
          <span>to</span>
          <select 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            {MONTH_KEYS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
          </select>
        </div>
      </div>

      {/* 2. Page Title */}
      <h1 className="text-3xl font-bold text-gray-900">
        Performance Summary
      </h1>

     {/* This grid wrapper arranges the cards horizontally and adds spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue"
          value="90%"
          details="+90%" // Pass "+" to trigger green arrow
          icon={<BarChart size={28} className="text-green-600" />}
          iconBg="bg-green-200" // Use a lighter bg for the opacity effect
        />
        <StatCard 
          title="Total Expenses"
          value="49,832"
          details={null} // No arrow
          icon={<User size={28} className="text-blue-600" />}
          iconBg="bg-blue-200"
        />
        <StatCard 
          title="Net Profit"
          value="$12,396" 
          details={null} // No arrow
          icon={<ShoppingBag size={28} className="text-orange-600" />}
          iconBg="bg-orange-200"
        />
        <StatCard 
          title="Mktg % Revenue"
          value="84%"
          details="-84%" // Pass "-" to trigger red arrow
          icon={<PieChart size={28} className="text-pink-600" />}
          iconBg="bg-pink-200"
        />
      </div>


      {/* 4. Chart Grid - Now renders the real chart components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <ChartCard title="Revenue Vs Expense">
          <RevenueVsExpensePie data={filteredData} />
        </ChartCard>
        <ChartCard title="Marketing Spend">
          <MarketingSpendArea data={filteredData} />
        </ChartCard>
        <ChartCard title="Cost Segment">
          <CostSegmentArea data={filteredData} />
        </ChartCard>
        <ChartCard title="Total Expense">
          <TotalExpenseDonut />
        </ChartCard>
      </div>

      {/* 5. Table Grid - Now renders tables with dummy data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <TableCard title="Individual Segment Fluctuation">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase">
                <th className="py-2 px-2">Segment</th>
                <th className="py-2 px-2">Total Cost</th>
                <th className="py-2 px-2">Avg. Monthly Cost</th>
                <th className="py-2 px-2">Fluctuation</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SEGMENT_FLUCTUATION.map(renderTableRow)}
            </tbody>
          </table>
        </TableCard>
        <TableCard title="Recent Variance Alert">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase">
                <th className="py-2 px-2">Segment</th>
                <th className="py-2 px-2">Current Cost</th>
                <th className="py-2 px-2">MoM %</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_VARIANCE_ALERT.map(renderTableRow)}
            </tbody>
          </table>
        </TableCard>
      </div>

    </div>
  );
};

export default DashboardPage;