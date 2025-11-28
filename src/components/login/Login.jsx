import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../firebase/auth';
import { useAuth } from '../../context/authContext'; // Ensure this matches your file structure
import logo from '../../components/login/download.png'

const RhombusIcon = () => (
  <img 
    src={logo}
    alt="Rhombus Logo" 
    className="w-6 h-6 mr-2"
    aria-hidden="true" 
  />
);

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.712 34.61 44 28.169 44 20c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .946-3.11 3.588-5.55 6.834-6.393m6.14 6.14A3 3 0 1012 12a3 3 0 001.025.218m-1.025.218A3 3 0 0112 12m0 0a3 3 0 003 3m-3-3H6m16.542 7l-20-20" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // ✨ Get 'loading' state to prevent premature checks
  const { userLoggedIn, userAccess, loading } = useAuth(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(location.state?.message || '');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // 1. Wait for AuthProvider to finish loading user & permissions
    if (loading) return;

    // 2. If logged in, check permissions
    if (userLoggedIn) {
      if (userAccess.accessGranted) {
        // Access Granted -> Go to Dashboard
        navigate('/home', { replace: true });
      } else {
        // Access Denied/Pending -> Stay here and show message
        setIsSigningIn(false); // Reset loading state of the button
        setErrorMessage("Access pending. An administrator must grant you permission before you can use the dashboard.");
      }
    }
  }, [userLoggedIn, userAccess, loading, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSigningIn) return;
    setIsSigningIn(true);
    setErrorMessage(''); 
    
    try {
      await doSignInWithEmailAndPassword(email, password);
      // Logic continues in useEffect once auth state changes
    } catch (error) {
      console.error("Error signing in:", error);
      setErrorMessage("Invalid email or password. Please try again.");
      setIsSigningIn(false);
    }
  };

  const onGoogleSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    setErrorMessage('');
    
    try {
      await doSignInWithGoogle();
      // Logic continues in useEffect once auth state changes
    } catch (error) {
      console.error("Error with Google Sign-In:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorMessage("Failed to sign in with Google.");
      }
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-5">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-start mb-6 text-gray-700 text-lg font-semibold">
          <RhombusIcon />
          <span>PPGP Dashboard</span>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
        <p className="text-sm text-gray-600 mb-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#6D79CF] hover:underline font-medium">
            Sign Up
          </Link>
        </p>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-4 relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button" 
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"} 
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <Link to="/reset-password" className="block text-sm text-[#6D79CF] hover:underline -mt-2 mb-5">
            Forgot password?
          </Link>

          {errorMessage && (
            <p 
              className={`text-sm text-center mb-4 ${
                errorMessage.includes("Access pending") || errorMessage.includes("Account created")
                  ? 'text-yellow-600 bg-yellow-50 p-2 rounded' 
                  : 'text-red-600'
              }`}
              aria-live="polite" 
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full py-3 bg-[#6D79CF] text-white rounded-md font-semibold hover:bg-[#7D79CF] disabled:bg-purple-300 mb-6"
          >
            {isSigningIn ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button
          onClick={onGoogleSignIn}
          disabled={isSigningIn}
          className="w-full py-3 bg-white border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-70 mb-8"
        >
          <GoogleIcon />
          <span>Google</span>
        </button>

        <p className="text-xs text-gray-500 text-center">
          Protected by reCAPTCHA and subject to the Rhombus{' '}
          <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a> and{' '}
          <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;