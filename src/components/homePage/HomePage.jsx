import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../header/Header';
import DashboardPage from '../DashboardPage/DashboardPage';
import InputPage from '../inputPage/InputPage'; 

// This component now acts as the main layout (Header + Page Content)
// for all protected routes.
const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Main content area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* ✨ UPDATED: Instead of hard-coding DashboardPage,
          we now use Routes to render the correct page
          based on the URL.
        */}
        <Routes>
          {/* /home will render the DashboardPage */}
          <Route path="/" element={<DashboardPage />} /> 
          
          {/* /home/input will render the new InputPage */}
          <Route path="/data" element={<InputPage />} />

          {/* /home/data will render a placeholder for now */}
          <Route path="/input" element={
            <div className="bg-white p-6 rounded-lg shadow">
              <h1 className="text-2xl font-bold">Data Table Page</h1>
              <p className="mt-2 text-gray-600">This page is not yet implemented.</p>
            </div>
          } />

          {/* /home/profile will render a placeholder */}
           <Route path="/profile" element={
            <div className="bg-white p-6 rounded-lg shadow">
              <h1 className="text-2xl font-bold">User Profile Page</h1>
              <p className="mt-2 text-gray-600">This page is not yet implemented.</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default Home;