import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Helper component to parse the 'details' prop and show the arrow
const ChangeIndicator = ({ details }) => {
  if (!details || typeof details !== 'string') {
    return null; // Don't render anything if no details are provided
  }

  // Check if the string starts with '+' or a number (implies positive)
  const isPositive = details.startsWith('+') || !details.startsWith('-');
  // Check if it's a negative change
  const isNegative = details.startsWith('-');

  // The text to display (e.g., "90%" from "+90%")
  const displayText = details.replace('+', '').replace('-', '');

  return (
    <span className={`flex items-center text-sm font-medium ml-1.5 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive && <TrendingUp size={16} className="mr-0.5" />}
      {isNegative && <TrendingDown size={16} className="mr-0.5" />}
      {displayText}
    </span>
  );
};

const StatCard = ({ title, value, icon, iconBg, details }) => {
  return (
    // Card container: 
    // - rounded-xl and shadow-sm for the image's style
    // - p-6 for more whitespace
    // - relative overflow-hidden is CRITICAL for the circle effect
    <div className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
      
      {/* Faint Background Circle */}
      {/* This is positioned absolutely, with low opacity, and partially off-screen. */}
      {/* The parent's 'overflow-hidden' clips it to create the segment effect. */}
      <div className={`absolute w-36 h-36 ${iconBg} opacity-20 rounded-full -right-14 -top-14`} />
      
      {/* Content (on top) */}
      {/* This wrapper sits on top of the circle with z-10 */}
      <div className="relative z-10 flex items-center justify-between w-full space-x-4">
        
        {/* Left Side: Text Content */}
        <div className="flex-shrink-0">
          <div className="flex items-baseline">
            <p className="text-3xl font-extrabold text-gray-800">{value}</p>
            <ChangeIndicator details={details} />
          </div>
          <p className="text-sm font-medium text-gray-500 truncate mt-0.5">{title}</p>
        </div>

        {/* Right Side: Icon */}
        <div className="flex-shrink-0">
          {icon}
        </div>
      </div>

    </div>
  );
};

export default StatCard;