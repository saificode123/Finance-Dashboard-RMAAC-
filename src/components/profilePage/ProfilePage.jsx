import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
// Import the firebase functions we'll need
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { doPasswordChange } from '../../firebase/auth';
// Import icons
import { User, Shield, Database, Loader2, CheckCircle, AlertTriangle, Key } from 'lucide-react';

// --- Helper function to format dates ---
const formatFirebaseTimestamp = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// --- Main Profile Page Component ---
const ProfilePage = () => {
  const { currentUser, db } = useAuth();
  const [dbInfo, setDbInfo] = useState({
    segmentCount: 0,
    costMonthCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const appId = import.meta.env.VITE_PROJECT_ID;

  // --- Effect to load data from Firestore ---
  useEffect(() => {
    if (!db || !currentUser) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const userId = currentUser.uid;

        // 1. Fetch Segment Data
        const segmentsRef = doc(db, `artifacts/${appId}/users/${userId}/master_data`, 'master_segments');
        const segmentsSnap = await getDoc(segmentsRef);
        let segmentTotal = 0;
        if (segmentsSnap.exists()) {
          const data = segmentsSnap.data();
          segmentTotal += (data.fixed || []).length;
          segmentTotal += Object.values(data.variable || {}).flat().length;
        }

        // 2. Fetch Monthly Cost Data
        const costsRef = collection(db, `artifacts/${appId}/users/${userId}/monthly_costs`);
        const costsSnap = await getDocs(costsRef);
        const costCount = costsSnap.size; // This just counts the documents

        setDbInfo({
          segmentCount: segmentTotal,
          costMonthCount: costCount,
        });

      } catch (e) {
        console.error("Error fetching profile data:", e);
        setError("Could not load database information.");
      }
      setIsLoading(false);
    };

    fetchData();
  }, [db, currentUser, appId]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
      
      {/* --- Grid for Profile Cards --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Account Information */}
        <div className="lg:col-span-2">
          <AccountInfoCard currentUser={currentUser} />
        </div>

        {/* Card 2: Database Summary */}
        <DatabaseInfoCard dbInfo={dbInfo} isLoading={isLoading} error={error} />

        {/* Card 3: Change Password */}
        <div className="lg:col-span-3">
          <ChangePasswordCard />
        </div>
        
      </div>
    </div>
  );
};

// --- Sub-Component: Account Info Card ---
const AccountInfoCard = ({ currentUser }) => {
  if (!currentUser) return null;

  const { email, uid, metadata, emailVerified } = currentUser;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-6 pb-4 border-b">
        <User size={20} className="mr-2 text-[#6D79CF]" />
        Account Information
      </h3>
      <div className="space-y-4 text-sm">
        <InfoRow label="Email Address" value={email} />
        <InfoRow label="User ID" value={uid} />
        <InfoRow label="Account Created" value={formatFirebaseTimestamp(metadata.creationTime)} />
        <InfoRow label="Last Sign-In" value={formatFirebaseTimestamp(metadata.lastSignInTime)} />
        
        {/* Email Verification Status */}
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-500 font-medium">Email Status</span>
          {emailVerified ? (
            <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
              <CheckCircle size={14} /> Verified
            </span>
          ) : (
            <span className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
              <AlertTriangle size={14} /> Not Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Database Info Card ---
const DatabaseInfoCard = ({ dbInfo, isLoading, error }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-6 pb-4 border-b">
        <Database size={20} className="mr-2 text-[#6D79CF]" />
        Your Data
      </h3>
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="animate-spin mr-2" /> Loading data...
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4 text-sm">
          <InfoRow label="Saved Segments" value={`${dbInfo.segmentCount} total`} />
          <InfoRow label="Cost Data" value={`${dbInfo.costMonthCount} months saved`} />
        </div>
      )}
    </div>
  );
};

// --- Sub-Component: Change Password Card ---
const ChangePasswordCard = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('Error: Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setStatus('Error: Password must be at least 6 characters.');
      return;
    }

    setIsSaving(true);
    setStatus('Changing password...');
    try {
      await doPasswordChange(password);
      setStatus('Success: Your password has been updated!');
      setPassword('');
      setConfirmPassword('');
    } catch (e) {
      console.error("Password change error:", e);
      // This error often means the user needs to re-authenticate
      if (e.code === 'auth/requires-recent-login') {
        setStatus('Error: This is a sensitive action. Please log out and log back in before changing your password.');
      } else {
        setStatus(`Error: ${e.message}`);
      }
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatus(''), 7000);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-6 pb-4 border-b">
        <Key size={20} className="mr-2 text-[#6D79CF]" />
        Change Password
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="new-password">
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            placeholder="New password (min. 6 characters)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirm-password">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            placeholder="Confirm new password"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center px-4 py-2.5 bg-[#6D79CF] text-white rounded-lg font-semibold hover:bg-[#7D79CF] disabled:bg-purple-300 min-w-[150px]"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : 'Update Password'}
          </button>
          {status && (
            <p className={`text-sm font-bold ${status.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>
              {status}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

// --- Helper: InfoRow Sub-Component ---
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b last:border-b-0">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-800 font-semibold break-all">{value}</span>
  </div>
);

export default ProfilePage;