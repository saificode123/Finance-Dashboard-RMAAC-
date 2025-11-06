import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { doPasswordReset } from '../../firebase/auth';
import logo from '../login/download.png'

const RhombusIcon = () => (
  <img 
    src={logo}
    alt="Rhombus Logo" 
    className="w-6 h-6 mr-2"
    aria-hidden="true" 
  />
);

const ResetPage = () => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await doPasswordReset(email);
      setSuccessMessage('Password reset email sent! Please check your inbox (and spam folder).');
      setEmail(''); 
    } catch (error) {
      console.error("Error sending password reset:", error);
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('No account found with this email address.');
      } else {
        setErrorMessage('Failed to send reset email. Please try again.');
      }
    }
    setIsSending(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-5">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-start mb-6 text-gray-700 text-lg font-semibold">
          <RhombusIcon />
          <span>PPGP Dashboard</span>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot password?</h2>

        {successMessage ? (
          <div className="mt-6">
            <p 
              className="text-green-600 text-sm text-center p-3 bg-green-50 rounded-md"
              aria-live="polite"
            >
              {successMessage}
            </p>
            <Link 
              to="/" 
              className="block text-center mt-6 text-[#6D79CF] hover:underline font-medium"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-6">
              No worries! Just enter your email and we'll send you a reset password link.
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
                  placeholder="hello@designspace.io"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6D79CF]"
                />
              </div>

              {errorMessage && (
                <p 
                  className="text-red-600 text-sm text-center mb-4"
                  aria-live="polite"
                >
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 bg-[#6D79CF] text-white rounded-md font-semibold hover:bg-[#7D79CF] disabled:bg-purple-300 mb-6"
              >
                {isSending ? 'Sending...' : 'Send Recovery Email'}
              </button>
            </form>

            <p className="text-sm text-gray-600 text-center">
              Just remember?{' '}
              {/* Corrected this link to go to Sign In, not Sign Up */}
              <Link to="/" className="text-[#6D79CF] hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default ResetPage;