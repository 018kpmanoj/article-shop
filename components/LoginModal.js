'use client'

import { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaGoogle, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function LoginModal({ isOpen, onClose, initialMode = 'signup' }) {
  // Default to signup mode - registration first approach
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginWithEmail, signUpWithEmail, loginWithGoogle, resetPassword, firebaseReady } = useAuth();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setSuccess('');
      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialMode]);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setError('');
    setSuccess('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const getErrorMessage = (error) => {
    if (!error) return 'An error occurred';
    if (error.includes('user-not-found')) return 'No account found. Please sign up first!';
    if (error.includes('wrong-password')) return 'Incorrect password';
    if (error.includes('invalid-credential')) return 'Invalid email or password. Please sign up first if you don\'t have an account.';
    if (error.includes('email-already-in-use')) return 'Email already registered. Please sign in instead.';
    if (error.includes('invalid-email')) return 'Invalid email address';
    if (error.includes('weak-password')) return 'Password is too weak (min 6 characters)';
    if (error.includes('popup-closed')) return 'Sign-in popup was closed';
    if (error.includes('network-request-failed')) return 'Network error. Please try again.';
    return error;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await loginWithEmail(email, password);
      if (result.success) {
        handleClose();
      } else {
        setError(getErrorMessage(result.error));
      }
    } catch (err) {
      setError('An error occurred during login');
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const result = await signUpWithEmail(email, password, displayName);
      if (result.success) {
        handleClose();
      } else {
        setError(getErrorMessage(result.error));
      }
    } catch (err) {
      setError('An error occurred during signup');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        handleClose();
      } else {
        setError(getErrorMessage(result.error));
      }
    } catch (err) {
      setError('An error occurred with Google login');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await resetPassword(email);
      if (result.success) {
        setSuccess('Password reset email sent! Check your inbox.');
      } else {
        setError(getErrorMessage(result.error));
      }
    } catch (err) {
      setError('An error occurred');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Full screen overlay - fixed to viewport */}
      <div 
        className="fixed inset-0 z-[99999] overflow-y-auto"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      >
        {/* Centering container */}
        <div className="min-h-screen flex items-center justify-center p-4">
          {/* Backdrop click */}
          <div 
            className="fixed inset-0"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <div 
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10 bg-white/80 dark:bg-gray-800/80 rounded-full"
              type="button"
            >
              <FaTimes size={18} />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
              <div className="flex items-center gap-3">
                {mode === 'signup' && <FaUserPlus size={24} />}
                {mode === 'login' && <FaSignInAlt size={24} />}
                {mode === 'reset' && <FaEnvelope size={24} />}
                <h2 className="text-2xl font-bold">
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'login' && 'Welcome Back!'}
                  {mode === 'reset' && 'Reset Password'}
                </h2>
              </div>
              <p className="text-blue-100 mt-2">
                {mode === 'signup' && 'Join K P Manoj Tech Trends community'}
                {mode === 'login' && 'Sign in to access premium content'}
                {mode === 'reset' && 'Enter your email to reset password'}
              </p>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Firebase Not Configured Warning */}
              {!firebaseReady && (
                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    ⚠️ Authentication is not configured yet.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              {/* Success Message */}
              {success && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg text-sm">
                  {success}
                </div>
              )}

              {firebaseReady && (
                <>
                  {/* Google Sign In - works for both signup and login */}
                  {mode !== 'reset' && (
                    <>
                      <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        type="button"
                        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                      >
                        <FaGoogle className="text-red-500" size={20} />
                        Continue with Google
                      </button>

                      <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
                            or with email
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Sign Up Form - Default */}
                  {mode === 'signup' && (
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Your name"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password (min 6 characters)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? 'Creating account...' : (
                          <>
                            <FaUserPlus /> Create Account
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Login Form */}
                  {mode === 'login' && (
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? 'Signing in...' : (
                          <>
                            <FaSignInAlt /> Sign In
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Reset Password Form */}
                  {mode === 'reset' && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                      >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                      </button>
                    </form>
                  )}
                </>
              )}

              {/* Footer Links */}
              <div className="mt-6 text-center text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                {mode === 'signup' && (
                  <p className="text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                )}
                {mode === 'login' && (
                  <>
                    <button
                      type="button"
                      onClick={() => { setMode('reset'); setError(''); setSuccess(''); }}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        Sign up
                      </button>
                    </p>
                  </>
                )}
                {mode === 'reset' && (
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Back to Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
