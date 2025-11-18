import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/authContext';
// ✨ CORRECT: Imports are from 'firebase/firestore'
import { doc, setDoc, onSnapshot, getDoc, Timestamp } from 'firebase/firestore'; 
import { Save, Loader2 } from 'lucide-react';
import { MONTH_KEYS } from '../dummydata/DummyData';

// --- Main Page Component ---
const CostInputPage = () => {
  // ✨ CORRECT: Get db from the context, not a direct import
  const { db, currentUser } = useAuth(); 
  const userId = currentUser?.uid;
  const appId = 'finance-3f570'; // From your docs

  // State for master segments (loaded from DB)
  const [segments, setSegments] = useState({ fixed: [], variable: {} });
  const [isSegmentsLoading, setIsSegmentsLoading] = useState(true);

  // State for the month picker
  const [inputMonthKey, setInputMonthKey] = useState(MONTH_KEYS[MONTH_KEYS.length - 1].key);
  const inputMonthLabel = MONTH_KEYS.find(m => m.key === inputMonthKey)?.label || 'N/A';
  
  // State for the cost input form
  const [fixedCosts, setFixedCosts] = useState([]);
  const [categorizedVariableCosts, setCategorizedVariableCosts] = useState({});
  const [status, setStatus] = useState('Select a month to start.');
  const [isFetchingData, setIsFetchingData] = useState(false); // Loading *cost* data
  const [isSaving, setIsSaving] = useState(false); // Saving *cost* data

  const VARIABLE_CATEGORIES = ['Salaries & Wages', 'Lab Charges', 'Subscriptions', 'Other Variable Costs'];

  // --- Data Loading Effects ---

  // EFFECT 1: Load the Master Segment List
  useEffect(() => {
    if (!db || !userId) return;
    setIsSegmentsLoading(true);
    const docRef = doc(db, `artifacts/${appId}/users/${userId}/master_data`, 'master_segments');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const variableSubs = data.variable?.['Subscriptions (Variable)'] || [];
        setSegments({ 
          fixed: data.fixed || [], 
          variable: {
            'Salaries & Wages': data.variable?.['Salaries & Wages'] || [],
            'Lab Charges': data.variable?.['Lab Charges'] || [],
            'Subscriptions': data.variable?.['Subscriptions'] || variableSubs,
            'Other Variable Costs': data.variable?.['Other Variable Costs'] || [],
          }
        });
      } else {
        setSegments({ fixed: [], variable: {} });
        console.warn("No master segments found. Please add segments in the 'Manage Segments' page.");
      }
      setIsSegmentsLoading(false);
    }, (error) => {
      console.error("Error fetching master segments:", error);
      setIsSegmentsLoading(false);
    });

    return () => unsubscribe();
  }, [db, userId, appId]);

  // EFFECT 2: Load the Cost Data for the selected month
  useEffect(() => {
    if (isSegmentsLoading || !db || !userId) return;

    const mergeCosts = (staticSegments, savedCosts) => 
      staticSegments.map(segment => ({ 
          segment, 
          cost: (savedCosts || []).find(c => c.segment === segment)?.cost || 0 
      }));

    const fetchData = async () => {
      setIsFetchingData(true);
      setStatus('Fetching data for ' + inputMonthLabel);
      const docRef = doc(db, `artifacts/${appId}/users/${userId}/monthly_costs`, inputMonthKey);
      
      try {
        const docSnap = await getDoc(docRef);
        const data = docSnap.exists() ? docSnap.data() : {};
        
        setFixedCosts(mergeCosts(segments.fixed, data.fixedCosts));
        
        const mergedVariableCosts = {};
        for (const category of VARIABLE_CATEGORIES) {
          mergedVariableCosts[category] = mergeCosts(segments.variable[category] || [], data.variableCosts);
        }
        setCategorizedVariableCosts(mergedVariableCosts);
        
        setStatus(`Showing data for ${inputMonthLabel}.`);
      } catch (e) {
        console.error("Error fetching cost data: ", e);
        setStatus('Error loading cost data.');
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchData();
  }, [db, userId, appId, inputMonthKey, segments, isSegmentsLoading, inputMonthLabel]); 

  // --- Event Handlers ---

  const handleSaveCosts = async () => {
    if (!db || !userId) { setStatus('Error: Database connection not ready.'); return; }

    setIsSaving(true);
    setStatus('Saving costs...');

    const flattenedVariableCosts = Object.values(categorizedVariableCosts).flat();
    const docRef = doc(db, `artifacts/${appId}/users/${userId}/monthly_costs`, inputMonthKey);

    try {
      await setDoc(docRef, {
        month: Timestamp.fromDate(new Date(inputMonthKey)),
        fixedCosts: fixedCosts.filter(f => f.cost > 0), 
        variableCosts: flattenedVariableCosts.filter(v => v.cost > 0),
        updatedAt: Timestamp.now()
      });
      setStatus('Costs saved successfully!');
    } catch (e) { 
      console.error("Error saving cost document: ", e); 
      setStatus(`Error: ${e.message}`); 
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatus(`Showing data for ${inputMonthLabel}.`), 3000);
    }
  };
  
  // Renders the input rows (styling from screenshots)
  const renderCostInputs = (costs, setCosts) => (
    <div className="space-y-3">
      {costs.map((cost, index) => (
        <div key={cost.segment} className="flex space-x-2 mb-2 items-center justify-between">
          <label className="flex-1 text-gray-700 truncate" htmlFor={`${cost.segment}-${index}`}>
            {cost.segment}
          </label>
          <input 
            id={`${cost.segment}-${index}`}
            type="number" 
            placeholder="0.00" 
            value={cost.cost || ''} 
            onChange={(e) => { 
              const newCosts = [...costs]; 
              newCosts[index].cost = parseFloat(e.target.value || 0); 
              setCosts(newCosts); 
            }} 
            className="w-32 bg-gray-50 border border-gray-300 p-2 rounded text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" 
          />
        </div>
      ))}
    </div>
  );

  const isLoading = isSegmentsLoading || isFetchingData;

  // --- JSX Render (Light Mode Layout) ---
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      
      {/* 1. Header (Month Picker + Status) */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Monthly Cost Data Input</h2>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700" htmlFor="month-select">
            Select Month:
          </label>
          <select
            id="month-select"
            value={inputMonthKey}
            onChange={(e) => setInputMonthKey(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
          >
            {MONTH_KEYS.slice().reverse().map(m => ( // Show newest months first
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <p className="text-gray-600 mb-6">
        Inputting costs for: <span className="font-semibold text-lg text-[#6D79CF]">{inputMonthLabel}</span>
        <span className="text-sm text-gray-500 ml-4">{status}</span>
      </p>

      {/* 2. Cost Input Form */}
      {isLoading ? (
        <div className="flex items-center justify-center p-10">
          <Loader2 className="animate-spin mr-2" /> Loading cost data...
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-x-8">
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-blue-600 mb-3">Fixed Costs</h4>
            {renderCostInputs(fixedCosts, setFixedCosts)}
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            {VARIABLE_CATEGORIES.map(category => (
              <div key={category} className="mb-6">
                <h4 className="text-lg font-semibold text-purple-600 mb-3">{category}</h4>
                {renderCostInputs(categorizedVariableCosts[category] || [], (newCosts) => {
                  setCategorizedVariableCosts(prev => ({
                    ...prev,
                    [category]: newCosts
                  }));
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Footer / Save Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleSaveCosts}
          disabled={isSaving || isLoading}
          className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
        >
          <Save size={20} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Costs to Database'}
        </button>
      </div>
    </div>
  );
};

export default CostInputPage;