import React, { useState } from 'react';
// ✨ FIXED: Removed .jsx extension for module resolution
import { useAuth } from '../../context/authContext'; 
import { doSignOut } from '../../firebase/auth'; 
import { useNavigate, Link } from 'react-router-dom';
import { Bell, MessageCircle, ChevronDown, LogOut, User } from 'lucide-react';
import logo from '../login/download.png'

// Using the same hosted logo from before
const RhombusIcon = () => (
  <img 
    src={logo} 
    alt="Rhombus Logo"
    className="w-8 h-8 mr-2"
  />
);

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get user's name (or a fallback)
  // We will update this later when we save names to Firestore
  const userName = currentUser.displayName || currentUser.email.split('@')[0];

  const handleSignOut = async () => {
    try {
      await doSignOut();
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Side: Logo and Title */}
          <div className="flex items-center">
            <RhombusIcon />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-800">PPGP Dashboard</span>
              <span className="text-xs text-gray-500">Admin Panel</span>
            </div>
          </div>

          {/* Middle: Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/home/report" className="text-sm font-medium text-gray-600 hover:text-[#6D79CF]">Report</Link>
            <Link to="/home/data" className="text-sm font-medium text-gray-600 hover:text-[#6D79CF]">Data Table</Link>
            <Link to="/home/input" className="text-sm font-medium text-gray-600 hover:text-[#6D79CF]">Input</Link>
          </nav>

          {/* Right Side: Icons and User Menu */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
              <MessageCircle size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
              <Bell size={20} />
            </button>

            {/* Divider */}
            <span className="h-6 w-px bg-gray-200" aria-hidden="true"></span>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none"
              >
                {/* Placeholder for user image */}
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                  <User size={16} className="text-gray-500" />
                </div>
                <span className="hidden md:inline text-gray-700 font-medium">Hello, {userName}</span>
                <ChevronDown size={16} className="ml-1 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <Link to="/home/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;