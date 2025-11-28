import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../header/Header';
import DashboardPage from '../DashboardPage/DashboardPage';
import InputPage from '../inputPage/InputPage'; 
import CostInputPage from '../DataInput/CostInputPage';
import ProfilePage from '../profilePage/ProfilePage';
import AdminUserManagement from '../adminSetting/AdminUserManagement';

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

          {/* /home/input will render the InputPage */}
          <Route path="/input" element={<InputPage />} />

          {/* /home/data will render CostInputPage */}
          <Route path="/data" element={<CostInputPage />} />

          {/* /home/profile will render a placeholder */}
           <Route path="/profile" element={
              <ProfilePage />
          } />
          {/* /home/adminsetting will render AdminUserManagement */}
          <Route path="/adminsetting" element={<AdminUserManagement />} />
        </Routes>
      </main>
    </div>
  );
};

export default Home;