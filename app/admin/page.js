'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getActivities, getLoginStats, getPageViewStats } from '@/lib/activityTracker';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  FaUsers, FaChartLine, FaShieldAlt, FaEye, FaSignInAlt, 
  FaGoogle, FaEnvelope, FaGlobe, FaClock, FaExclamationTriangle,
  FaArrowUp, FaArrowDown, FaFilter, FaDownload, FaSync
} from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  
  const [stats, setStats] = useState({
    totalLogins: 0,
    totalSignups: 0,
    googleLogins: 0,
    emailLogins: 0,
    uniqueUsers: 0,
    totalPageViews: 0,
    uniqueSessions: 0
  });
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState(7);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (!loading && user && !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin, dateRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch login stats
      const loginStats = await getLoginStats(dateRange);
      
      // Fetch page view stats
      const pageStats = await getPageViewStats(dateRange);
      
      // Fetch recent activities
      const recentActivities = await getActivities(100);
      
      // Fetch users
      const usersSnapshot = await getDocs(
        query(collection(db, 'users'), orderBy('lastLogin', 'desc'), limit(50))
      );
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastLogin: doc.data().lastLogin?.toDate?.() || new Date(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));

      setStats({
        totalLogins: loginStats.totalLogins,
        totalSignups: loginStats.totalSignups,
        googleLogins: loginStats.googleLogins,
        emailLogins: loginStats.emailLogins,
        uniqueUsers: loginStats.uniqueUsers,
        totalPageViews: pageStats.totalViews,
        uniqueSessions: pageStats.uniqueSessions,
        pageBreakdown: pageStats.pageBreakdown
      });
      setActivities(recentActivities);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FaShieldAlt /> Admin Dashboard
              </h1>
              <p className="text-blue-100 mt-1">
                Monitor user activity, logins, and website interactions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(Number(e.target.value))}
                className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white backdrop-blur-sm"
              >
                <option value={7} className="text-gray-900">Last 7 days</option>
                <option value={14} className="text-gray-900">Last 14 days</option>
                <option value={30} className="text-gray-900">Last 30 days</option>
                <option value={90} className="text-gray-900">Last 90 days</option>
              </select>
              <button
                onClick={fetchDashboardData}
                disabled={isLoading}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <FaSync className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<FaSignInAlt />}
            label="Total Logins"
            value={stats.totalLogins}
            color="blue"
          />
          <StatCard
            icon={<FaUsers />}
            label="Total Signups"
            value={stats.totalSignups}
            color="green"
          />
          <StatCard
            icon={<FaEye />}
            label="Page Views"
            value={stats.totalPageViews}
            color="purple"
          />
          <StatCard
            icon={<FaGlobe />}
            label="Unique Sessions"
            value={stats.uniqueSessions}
            color="orange"
          />
        </div>

        {/* Login Method Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaChartLine className="text-blue-500" /> Login Methods
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <FaGoogle className="text-red-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Google</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.googleLogins}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({stats.totalLogins > 0 ? Math.round((stats.googleLogins / stats.totalLogins) * 100) : 0}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FaEnvelope className="text-blue-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Email</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.emailLogins}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({stats.totalLogins > 0 ? Math.round((stats.emailLogins / stats.totalLogins) * 100) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaEye className="text-purple-500" /> Top Pages
            </h2>
            <div className="space-y-3">
              {stats.pageBreakdown && Object.entries(stats.pageBreakdown)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([path, count]) => (
                  <div key={path} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                      {path === '/' ? 'Home' : path}
                    </span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {count} views
                    </span>
                  </div>
                ))
              }
              {(!stats.pageBreakdown || Object.keys(stats.pageBreakdown).length === 0) && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No page view data yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {['overview', 'users', 'activities', 'security'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Registered Users ({users.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Logins</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Last Login</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {(user.email?.[0] || 'U').toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {user.displayName || 'Anonymous'}
                            </p>
                            {user.isAdmin && (
                              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.loginCount || 1}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {user.lastLogin?.toLocaleDateString?.() || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {user.createdAt?.toLocaleDateString?.() || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No users registered yet
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Activities
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
              {activities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getActivityBadgeColor(activity.action)}`}>
                          {activity.action?.replace(/_/g, ' ')}
                        </span>
                        {activity.data?.email && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.data.email}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {activity.path || activity.url}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {activity.timestamp?.toLocaleString?.() || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No activities recorded yet
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Overview
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Total Unique Users</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.uniqueUsers}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400">Conversion Rate</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {stats.uniqueSessions > 0 ? Math.round((stats.totalSignups / stats.uniqueSessions) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Signups */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Users
              </h2>
              <div className="space-y-3">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {(user.email?.[0] || 'U').toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {user.displayName || user.email?.split('@')[0]}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No users yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-red-500" /> Security Overview
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400">Rate Limiting</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">Active</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400">Honeypot Protection</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">Active</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-600 dark:text-green-400">Login Rate Limit</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">5 attempts/min</p>
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Failed Login Attempts
            </h3>
            <div className="space-y-2">
              {activities
                .filter(a => a.action?.includes('failed'))
                .slice(0, 10)
                .map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaExclamationTriangle className="text-red-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {activity.data?.email || 'Unknown'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.timestamp?.toLocaleString?.() || 'N/A'}
                    </span>
                  </div>
                ))
              }
              {activities.filter(a => a.action?.includes('failed')).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No failed login attempts
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, trend }) {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${colors[color]} text-white`}>
          {icon}
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

function getActivityBadgeColor(action) {
  const colors = {
    login: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    google_login: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    email_login: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    signup: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    logout: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    page_view: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    article_read: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    login_failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    google_login_failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    signup_failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };
  return colors[action] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
}
