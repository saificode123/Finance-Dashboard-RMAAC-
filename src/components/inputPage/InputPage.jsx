import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { List, Plus, Trash2, Loader2 } from 'lucide-react';

// --- 1. Segment Manager Component ---
const SegmentManager = ({ db, userId, appId, segments, isSegmentsLoading }) => {
  const [newSegment, setNewSegment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('fixed');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const VARIABLE_CATEGORIES = ['Salaries & Wages', 'Lab Charges', 'Subscriptions', 'Other Variable Costs'];

  const handleAddSegment = async () => {
    if (!newSegment.trim()) return;

    const updatedSegments = JSON.parse(JSON.stringify(segments)); 
    if (selectedCategory === 'fixed') {
      if (!updatedSegments.fixed.includes(newSegment.trim())) {
        updatedSegments.fixed.push(newSegment.trim());
      }
    } else {
      if (!updatedSegments.variable[selectedCategory]) {
        updatedSegments.variable[selectedCategory] = [];
      }
      if (!updatedSegments.variable[selectedCategory].includes(newSegment.trim())) {
        updatedSegments.variable[selectedCategory].push(newSegment.trim());
      }
    }

    await saveSegments(updatedSegments, "Segment added successfully!");
    setNewSegment('');
  };

  const handleDeleteSegment = async (category, segmentToDelete) => {
    const updatedSegments = JSON.parse(JSON.stringify(segments)); 
    if (category === 'fixed') {
      updatedSegments.fixed = updatedSegments.fixed.filter(s => s !== segmentToDelete);
    } else {
      updatedSegments.variable[category] = updatedSegments.variable[category].filter(s => s !== segmentToDelete);
    }
    await saveSegments(updatedSegments, "Segment deleted successfully!");
  };

  const saveSegments = async (newSegments, successMessage) => {
    if (!db || !userId) {
      setStatus("Error: Not connected.");
      return;
    }
    
    // This is the correct path, using the correct appId
    const docRef = doc(db, `artifacts/${appId}/users/${userId}/master_data`, 'master_segments');
    setIsSaving(true);
    setStatus('Saving...');

    try {
      // Removed the timeout. We will wait for the real response.
      await setDoc(docRef, newSegments, { merge: true });
      setStatus(successMessage);

    } catch (e) {
      console.error("Error saving segments:", e);
      // This will show the REAL Firebase error (e.g., "Permission Denied")
      setStatus(`Error: ${e.message}`); 
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatus(''), 7000); 
    }
  };

  if (isSegmentsLoading) {
    return <div className="flex items-center justify-center p-4"><Loader2 className="animate-spin mr-2" /> Loading Segments...</div>;
  }

  // --- The rest of the component (JSX) ---
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
        <List size={20} className="mr-2" />
        Manage Expense Segments
      </h3>
      
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="fixed">Fixed Costs</option>
          {VARIABLE_CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New Segment Name (e.g., Rent)"
          value={newSegment}
          onChange={(e) => setNewSegment(e.target.value)}
          className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        />
        <button
          onClick={handleAddSegment}
          disabled={isSaving}
          className="flex items-center justify-center px-4 py-2.5 bg-[#6D79CF] text-white rounded-lg font-semibold hover:bg-[#7D79CF] disabled:bg-purple-300 min-w-[140px]"
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <Plus size={16} className="mr-1" />}
          {isSaving ? 'Saving...' : 'Add Segment'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2 pb-2 border-b">Fixed Costs</h4>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {segments.fixed.map(s => (
              <li key={s} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="truncate">{s}</span>
                <button disabled={isSaving} onClick={() => handleDeleteSegment('fixed', s)}>
                  <Trash2 size={14} className="text-red-500 cursor-pointer hover:text-red-700" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
           <h4 className="font-semibold text-gray-700 mb-2 pb-2 border-b">Variable Costs</h4>
           <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {VARIABLE_CATEGORIES.map(category => (
                <div key={category}>
                    <h5 className="font-medium text-gray-600 mb-1">{category}</h5>
                    <ul className="space-y-2">
                      {(segments.variable[category] || []).map(s => (
                        <li key={s} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span className="truncate">{s}</span>
                          <button disabled={isSaving} onClick={() => handleDeleteSegment(category, s)}>
                            <Trash2 size={14} className="text-red-500 cursor-pointer hover:text-red-700" />
                          </button>
                        </li>
                      ))}
                    </ul>
                </div>
            ))}
           </div>
        </div>
      </div>
      
      {status && (
        <p className={`text-center mt-4 text-sm font-bold ${status.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
          {status}
        </p>
      )}
    </div>
  );
};


// --- 3. Main Page Component ---
const InputPage = () => {
  const { db, currentUser } = useAuth();
  const userId = currentUser?.uid;
  
  // ✨ --- THE FIX --- ✨
  // My typo 'finance-3f50' is now corrected to 'finance-3f570'
  const appId = 'finance-3f570'; // From your docs
  
  const [segments, setSegments] = useState({ fixed: [], variable: {} });
  const [isSegmentsLoading, setIsSegmentsLoading] = useState(true);

  const DEFAULT_SEGMENTS = {
    fixed: ['Rent', 'Utilities', 'Insurance', 'Subscriptions: Care Quality', 'Subscriptions: KEEPER SECURITY', 'Subscriptions: SHBC', 'Building Insurance', 'Subscriptions: Top Doctors Uk Lt Nc', 'Quick Books', 'Mobile + Internet', 'Klarna', 'Waste Management', 'Internet', 'Indemnity', 'HR Doctor', 'Misc'],
    variable: {
      'Salaries & Wages': ['Salaries & Wages-ANUM SHAHID', 'Salaries & Wages-AMY', 'Salaries & Wages-M. JAVD', 'Salaries & Wages-OMER AHMED', 'Salaries & Wages-SIDRA LATIF'],
      'Lab Charges': ['LAB Charges: Prime Health', 'LAB Charges: Randox Health', 'Lab Charges: Viva', 'LAB Charges: SONORAD'],
      'Subscriptions': ['Subscriptions: CANVA', 'Subscriptions: Adobe', 'Subscriptions: Gohighlevel', 'Subscriptions: RING STANDARD', 'Subscriptions: Semrush', 'Subscriptions: Freepik', 'Subscriptions CHATGPT', 'Subscriptions: Godaddy', 'Subscriptions: Agency Analytics'],
      'Other Variable Costs': ['Car Insurance', 'Training', 'Accountancy Fee', 'Admin', 'Advertising/SEO', 'Bank charges', 'Car Lease', 'Computer & Software', 'Donations', 'Equipments-Installment', 'Fuel Expenses', 'Internal Transfer', 'Internet Charges', 'Adnan Arif', 'Meals and Entertainment', 'Vehicle repair', 'Repair & Maintenence', 'TDL-Bill Payment', 'Waste Management'],
    }
  };

  useEffect(() => {
    if (!db || !userId) return;

    // This path will now be correct
    const docRef = doc(db, `artifacts/${appId}/users/${userId}/master_data`, 'master_segments');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSegments({ fixed: data.fixed || [], variable: data.variable || {} });
      } else {
        setSegments(DEFAULT_SEGMENTS);
        setDoc(docRef, DEFAULT_SEGMENTS, { merge: true }).catch(console.error);
      }
      setIsSegmentsLoading(false);
    }, (error) => {
      console.error("Error fetching master segments:", error);
      setIsSegmentsLoading(false);
    });

    return () => unsubscribe();
  }, [db, userId, appId]);
  
  return (
    <div>
      <SegmentManager 
        db={db}
        userId={userId}
        appId={appId}
        segments={segments}
        isSegmentsLoading={isSegmentsLoading}
      />
    </div>
  );
};

export default InputPage;