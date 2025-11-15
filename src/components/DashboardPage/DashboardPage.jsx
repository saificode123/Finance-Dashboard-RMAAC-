import React, { useState, useMemo } from 'react';
import { Home, ChevronRight, Calendar, BarChart, PieChart, ShoppingBag, User } from 'lucide-react';

// --- 1. Import DatePicker and its CSS ---
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// --- 2. Corrected Import Paths ---
// Assumes these components are in: /components/dashboard/
import StatCard from '../statCard/StatCard'; 
import ChartCard from '../graphs/ChartCard';
import TableCard from '../graphs/TableCard';

// Assumes your charts are in a subfolder: /components/dashboard/charts/
import RevenueVsExpensePie from '../graphs/RevenuePie'; 
import MarketingSpendArea from '../graphs/MarketingArea'; 
import CostSegmentArea from '../graphs/CostSegmentArea'; 
import TotalExpenseDonut from '../graphs/TotalExpenseDonut';

// Assumes your data is in: /src/data/
import { 
  MONTH_KEYS, 
  MOCK_FINANCIAL_DATA, 
  MOCK_SEGMENT_FLUCTUATION, 
  MOCK_VARIANCE_ALERT 
} from '../dummydata/DummyData'; 

// --- 3. Helper Functions ---
const formatCurrency = (value) => {
  if (typeof value !== 'number') return '$0';
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
};

const getMonthKey = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
};

// --- Main Dashboard Page Component ---
const DashboardPage = () => {

  // --- 4. State for Date Filter ---
  const defaultStartDate = new Date(MONTH_KEYS[Math.max(0, MONTH_KEYS.length - 6)].key);
  const defaultEndDate = new Date(MONTH_KEYS[MONTH_KEYS.length - 1].key);
  
  // Now we use two independent states for start and end
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // --- 5. Data Processing (Memoized) ---
  const filteredData = useMemo(() => {
    const startKey = getMonthKey(startDate);
    const endKey = getMonthKey(endDate);
    if (!startKey || !endKey) return [];
    
    // When you have a real API, this is what you'll send:
    // (e.g., /api/data?start=2025-05-01&end=2025-07-01)
    return MOCK_FINANCIAL_DATA.filter(
      d => d.monthKey >= startKey && d.monthKey <= endKey
    );
  }, [startDate, endDate]); // Dependency array is now [startDate, endDate]

  const stats = useMemo(() => {
    const totalRevenue = filteredData.reduce((acc, item) => acc + item.revenue, 0);
    const totalExpenses = filteredData.reduce((acc, item) => acc + item.expenses, 0);
    const netProfit = totalRevenue - totalExpenses;
    const marketingSpend = filteredData.reduce((acc, item) => acc + item.marketingSpend, 0);
    const mktgRevenue = totalRevenue > 0 ? (marketingSpend / totalRevenue) : 0;
    
    return { totalRevenue, totalExpenses, netProfit, mktgRevenue };
  }, [filteredData]);

  // --- 6. Table Row Renderer (Helper) ---
  const renderTableRow = (item) => (
    <tr key={item.segment} className="border-b border-gray-100 last:border-b-0">
      <td className="py-3 px-2 text-sm text-gray-700">{item.segment}</td>
      <td className="py-3 px-2 text-sm text-gray-500">{formatCurrency(item.totalCost || item.currentCost)}</td>
      <td className="py-3 px-2 text-sm text-gray-500">{formatCurrency(item.avgMonthlyCost || item.mom)}</td>
      {item.fluctuation !== undefined && (
        <td className="py-3 px-2 text-sm text-gray-500">{formatCurrency(item.fluctuation)}</td>
      )}
    </tr>
  );

  // --- 7. JSX (Component Render) ---
  return (
    <div className="space-y-6">
      
      {/* 1. Breadcrumb and Date Picker */}
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <nav className="flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
          <Home size={16} className="mr-2 text-gray-400" />
          <span className="font-medium text-gray-700">Dashboard</span>
          <ChevronRight size={16} className="mx-1" />
          <span>Summary</span>
        </nav>
        
        {/* --- ✨ ADJUSTED DATE FILTER --- */}
        {/* We now have two independent DatePickers, styled to look like one unit. */}
        <div className="flex items-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm">
          <Calendar size={16} className="ml-3 mr-1.5 text-gray-500" />
          
          {/* Start Date Picker (Month Picker) */}
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            // This logic is good: you can't pick a start date *after* the end date
            maxDate={endDate} 
            showMonthYearPicker // This is the key prop!
            dateFormat="MMM yyyy"
            // Simple styling to make it look like text
            className="w-24 py-2 text-gray-700 focus:outline-none"
            withPortal // Fixes z-index issues
          />
          
          <span className="mx-1 text-gray-400 font-medium">–</span> 
          
          {/* End Date Picker (Month Picker) */}
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            // This logic is good: you can't pick an end date *before* the start date
            minDate={startDate} 
            showMonthYearPicker // This is the key prop!
            dateFormat="MMM yyyy"
            className="w-24 py-2 text-gray-700 focus:outline-none"
            withPortal // Fixes z-index issues
          />
        </div>
      </div>

      {/* 2. Page Title */}
      <h1 className="text-3xl font-bold text-gray-900">
        Performance Summary
      </h1>

      {/* 3. Stat Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue"
          value="90%"
          details="+90%" 
          icon={<BarChart size={28} className="text-green-600" />}
          iconBg="bg-green-200"
        />
        <StatCard 
          title="Total Expenses"
          value="49,832"
          details={null} 
          icon={<User size={28} className="text-blue-600" />}
          iconBg="bg-blue-200"
        />
        <StatCard 
          title="Net Profit"
          value="$12,396" 
          details={null}
          icon={<ShoppingBag size={28} className="text-orange-600" />}
          iconBg="bg-orange-200"
        />
        <StatCard 
          title="Mktg % Revenue"
          value="84%"
          details="-84%"
          icon={<PieChart size={28} className="text-pink-600" />}
          iconBg="bg-pink-200"
        />
      </div>

      {/* 4. Chart Grid */}
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

      {/* 5. Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <TableCard title="Individual Segment Fluctuation">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase font-semibold">
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
              <tr className="text-left text-xs text-gray-400 uppercase font-semibold">
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