import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { db } from '../../firebase/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { 
  CheckCircle, 
  XCircle, 
  Mail, 
  Loader2, 
  ShieldAlert, 
  UserCheck, 
  Search 
} from 'lucide-react';

const AdminUserManagement = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'active', 'blocked'
  const [searchTerm, setSearchTerm] = useState('');

  // ✨ CRITICAL: Get Project ID to match SignUp path
  const appId = import.meta.env.VITE_PROJECT_ID;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // ✨ FIX: Fetch from 'artifacts/{appId}/users' instead of root 'users'
      const usersRef = collection(db, 'artifacts', appId, 'users');
      const snapshot = await getDocs(usersRef);
      
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserStatus = async (userId, newStatus, newAccess) => {
    try {
      // ✨ FIX: Update the document in the correct path
      const userRef = doc(db, 'artifacts', appId, 'users', userId);
      
      await updateDoc(userRef, {
        role: newStatus,          
        accessGranted: newAccess  
      });
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, role: newStatus, accessGranted: newAccess } 
          : user
      ));
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user status");
    }
  };

  // Action Helpers
  const handleApprove = (userId) => updateUserStatus(userId, 'user', true);
  const handleBlock = (userId) => updateUserStatus(userId, 'blocked', false);

  // Email Notification Helper
  const sendNotificationEmail = (email, type) => {
    let subject = "";
    let body = "";

    if (type === 'approve') {
      subject = "Account Approved - PPGP Dashboard";
      body = `Hello,\n\nYour account access has been approved by the Super Admin. You can now log in to the dashboard.\n\nLogin here: ${window.location.origin}`;
    } else if (type === 'block') {
      subject = "Account Access Suspended";
      body = `Hello,\n\nYour access to the PPGP Dashboard has been temporarily suspended. Please contact the administrator.`;
    }

    // Opens default email client
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // Filter Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'pending') return user.role === 'pending' || !user.accessGranted;
    if (filter === 'active') return user.accessGranted && user.role !== 'admin';
    if (filter === 'blocked') return user.role === 'blocked';
    
    return true;
  });

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 bg-gray-50">
        <ShieldAlert size={48} className="mb-4 text-red-500" />
        <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Access Management</h1>
          <p className="text-sm text-gray-500">Super Admin Control Panel</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button onClick={fetchUsers} className="px-4 py-2 text-sm text-[#6D79CF] border border-[#6D79CF] rounded hover:bg-purple-50">
            Refresh List
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          {['all', 'pending', 'active', 'blocked'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-[#6D79CF] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-[#6D79CF]" size={32} />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-12 text-gray-500">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{user.email}</span>
                        <span className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge role={user.role} accessGranted={user.accessGranted} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Approve Button */}
                        {!user.accessGranted && (
                          <button
                            onClick={() => { handleApprove(user.id); sendNotificationEmail(user.email, 'approve'); }}
                            className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-bold"
                          >
                            <CheckCircle size={14} /> Approve
                          </button>
                        )}
                        {/* Block Button */}
                        {user.accessGranted && user.role !== 'admin' && (
                          <button
                            onClick={() => { handleBlock(user.id); sendNotificationEmail(user.email, 'block'); }}
                            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-bold"
                          >
                            <XCircle size={14} /> Block
                          </button>
                        )}
                        <button onClick={() => sendNotificationEmail(user.email, 'approve')} className="p-1.5 text-gray-400 hover:text-[#6D79CF] rounded">
                          <Mail size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ role, accessGranted }) => {
  if (role === 'admin') return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Admin</span>;
  if (role === 'blocked') return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Blocked</span>;
  if (accessGranted) return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
};

export default AdminUserManagement;