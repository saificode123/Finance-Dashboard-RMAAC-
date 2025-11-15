import React from 'react';
import Header from '../header/Header';
import DashboardPage from '../DashboardPage/DashboardPage';

// This is your main protected page component.
// It assembles the layout: Header + Page Content.
const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Render the Header we just made */}
      <Header />

      {/* Main content area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Render the Dashboard content */}
        <DashboardPage />
      </main>
    </div>
  );
};

export default Home;