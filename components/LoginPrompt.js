'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginModal from './LoginModal';
import { FaUserCircle, FaSignOutAlt, FaCog, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';

// Time before showing login prompt (20 seconds)
const LOGIN_PROMPT_DELAY = 20000;

export default function LoginPrompt() {
  const [showModal, setShowModal] = useState(false);
  const [showPromptBanner, setShowPromptBanner] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  const { user, loading, isAdmin, logout } = useAuth();

  useEffect(() => {
    // Don't show prompt if user is already logged in
    if (user || loading) return;

    // Check if prompt was dismissed in this session
    const wasDismissed = sessionStorage.getItem('login_prompt_dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Show prompt after delay
    const timer = setTimeout(() => {
      if (!user && !dismissed) {
        setShowPromptBanner(true);
      }
    }, LOGIN_PROMPT_DELAY);

    return () => clearTimeout(timer);
  }, [user, loading, dismissed]);

  const handleDismiss = () => {
    setShowPromptBanner(false);
    setDismissed(true);
    sessionStorage.setItem('login_prompt_dismissed', 'true');
  };

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  // User is logged in - show user menu
  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-8 h-8 rounded-full border-2 border-blue-500"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
              {(user.email?.[0] || 'U').toUpperCase()}
            </div>
          )}
          <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
            {user.displayName || user.email?.split('@')[0]}
          </span>
        </button>

        {/* Dropdown Menu */}
        {showUserMenu && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowUserMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fadeIn">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {user.displayName || 'User'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
              
              <div className="p-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FaChartLine className="text-purple-500" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <FaSignOutAlt />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
        `}</style>
      </div>
    );
  }

  // User not logged in
  return (
    <>
      {/* Login Button in Header */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
      >
        <FaUserCircle />
        <span className="hidden sm:inline">Sign In</span>
      </button>

      {/* Floating Prompt Banner (appears after 20 seconds) */}
      {showPromptBanner && !dismissed && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 z-50 animate-slideUp">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <FaUserCircle className="text-white text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-white">
                Unlock Premium Content
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Sign in to save articles, get personalized recommendations, and access exclusive content.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { setShowModal(true); handleDismiss(); }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        initialMode="login"
      />

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}
