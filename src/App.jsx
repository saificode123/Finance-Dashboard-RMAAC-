import ProtectedRoute from './components/auth/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login/Login';
import { AuthProvider } from './context/authContext';
import SignUp from './components/signup/SignUp';
import ResetPage from './components/resetpage/ResetPage';
import HomePage from './components/homePage/HomePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} /> 
          <Route path="/reset-password" element={<ResetPage />} />
          
          {/* ✨ UPDATED: Changed path to /home/* to allow nested routes */}
          <Route 
            path="/home/*" // This allows /home, /home/input, /home/data etc.
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;