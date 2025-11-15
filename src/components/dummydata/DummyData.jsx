// This file contains all the mock data for the dashboard charts.
// You will replace this with your API calls.

// --- Date Keys for Filter ---
// Generated from your referencecode.txt
const MONTH_KEYS = [];
const startYear = 2025;
const startMonth = 1; // January
// Let's assume data up to Oct 2025
const currentYear = 2025;
const currentMonth = 10; 

for (let y = startYear; y <= currentYear; y++) {
    const endM = (y === currentYear) ? currentMonth : 12;
    const startM = (y === startYear) ? startMonth : 1;
    for (let m = startM; m <= endM; m++) {
        const monthKey = `${y}-${String(m).padStart(2, '0')}-01`;
        const date = new Date(monthKey);
        const monthLabel = date.toLocaleString('en-us', { month: 'short', year: '2-digit' });
        MONTH_KEYS.push({ key: monthKey, label: monthLabel });
    }
}
export { MONTH_KEYS };


// --- Main Monthly Data Array ---
export const MOCK_FINANCIAL_DATA = [
  { 
    month: 'Jan \'25', 
    monthKey: '2025-01-01', 
    revenue: 35000, 
    expenses: 22000, 
    marketingSpend: 5500, 
    costSegment: 7000 
  },
  { 
    month: 'Feb \'25', 
    monthKey: '2025-02-01', 
    revenue: 37500, 
    expenses: 24000, 
    marketingSpend: 6000, 
    costSegment: 7200 
  },
  { 
    month: 'Mar \'25', 
    monthKey: '2025-03-01', 
    revenue: 40000, 
    expenses: 25000, 
    marketingSpend: 6200, 
    costSegment: 7500 
  },
  { 
    month: 'Apr \'25', 
    monthKey: '2025-04-01', 
    revenue: 41000, 
    expenses: 26500, 
    marketingSpend: 6500, 
    costSegment: 7800 
  },
  { 
    month: 'May \'25', 
    monthKey: '2025-05-01', 
    revenue: 40500, 
    expenses: 26000, 
    marketingSpend: 6400, 
    costSegment: 7700 
  },
  { 
    month: 'Jun \'25', 
    monthKey: '2025-06-01', 
    revenue: 43000, 
    expenses: 27000, 
    marketingSpend: 6800, 
    costSegment: 8000 
  },
  { 
    month: 'Jul \'25', 
    monthKey: '2025-07-01', 
    revenue: 46000, 
    expenses: 28000, 
    marketingSpend: 7500, 
    costSegment: 8200 
  },
  { 
    month: 'Aug \'25', 
    monthKey: '2025-08-01', 
    revenue: 47500, 
    expenses: 29000, 
    marketingSpend: 7800, 
    costSegment: 8500 
  },
  { 
    month: 'Sep \'25', 
    monthKey: '2025-09-01', 
    revenue: 49000, 
    expenses: 30000, 
    marketingSpend: 8100, 
    costSegment: 8800 
  },
  { 
    month: 'Oct \'25', 
    monthKey: '2025-10-01', 
    revenue: 49832, // To match your "Total Expenses" number
    expenses: 31000, 
    marketingSpend: 8500, 
    costSegment: 9000 
  },
];

// --- Data for Tables ---
export const MOCK_SEGMENT_FLUCTUATION = [
  { segment: 'Marketing', totalCost: 38700, avgMonthlyCost: 7740, fluctuation: 7740 },
  { segment: 'Margaret', totalCost: 38700, avgMonthlyCost: 7740, fluctuation: 7740 },
  { segment: 'Joseph M', totalCost: 38700, avgMonthlyCost: 7740, fluctuation: 7740 },
  { segment: 'Malkhel D', totalCost: 38700, avgMonthlyCost: 7740, fluctuation: 7740 },
  { segment: 'Wesley', totalCost: 38700, avgMonthlyCost: 7740, fluctuation: 7740 },
];

export const MOCK_VARIANCE_ALERT = [
  { segment: 'Matilda R', currentCost: 38700, mom: 7740 },
  { segment: 'Margaret', currentCost: 38700, mom: 7740 },
  { segment: 'Joseph M', currentCost: 38700, mom: 7740 },
  { segment: 'Malkhel D', currentCost: 38700, mom: 7740 },
  { segment: 'Wesley', currentCost: 38700, mom: 7740 },
];