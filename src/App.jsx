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
          <Route 
            path="/home/*" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;