'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getActivities, getLoginStats, getPageViewStats } from '@/lib/activityTracker';
import { getSubscribers, getSubscriberCount, generateNewsletterContent, sendNewsletterEmail } from '@/lib/newsletter';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { articles } from '@/data';
import { 
  FaUsers, FaChartLine, FaShieldAlt, FaEye, FaSignInAlt, 
  FaGoogle, FaEnvelope, FaGlobe, FaClock, FaExclamationTriangle,
  FaArrowUp, FaArrowDown, FaSync, FaPaperPlane, FaNewspaper,
  FaUserCheck, FaCalendarAlt, FaBell
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
    uniqueSessions: 0,
    subscriberCount: 0
  });
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState(7);
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState('');

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
      
      // Fetch subscriber count
      const subCount = await getSubscriberCount();
      
      // Fetch subscribers list
      const subsList = await getSubscribers();
      
      // Fetch users
      let usersData = [];
      if (db) {
        try {
          const usersSnapshot = await getDocs(
            query(collection(db, 'users'), orderBy('lastLogin', 'desc'), limit(50))
          );
          usersData = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            lastLogin: doc.data().lastLogin?.toDate?.() || new Date(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date()
          }));
        } catch (e) {
          console.log('Users collection may not exist yet');
        }
      }

      setStats({
        totalLogins: loginStats.totalLogins,
        totalSignups: loginStats.totalSignups,
        googleLogins: loginStats.googleLogins,
        emailLogins: loginStats.emailLogins,
        uniqueUsers: loginStats.uniqueUsers,
        totalPageViews: pageStats.totalViews,
        uniqueSessions: pageStats.uniqueSessions,
        pageBreakdown: pageStats.pageBreakdown,
        subscriberCount: subCount
      });
      setActivities(recentActivities);
      setUsers(usersData);
      setSubscribers(subsList);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setIsLoading(false);
  };

  const handleSendNewsletter = async () => {
    if (subscribers.length === 0) {
      setNewsletterStatus('No subscribers to send to!');
      return;
    }

    setSendingNewsletter(true);
    setNewsletterStatus('Sending newsletter...');

    try {
      // Get latest articles
      const latestArticles = articles.slice(0, 5);
      const content = generateNewsletterContent(latestArticles, true);
      
      let successCount = 0;
      let failCount = 0;

      for (const subscriber of subscribers) {
        const result = await sendNewsletterEmail(
          subscriber.email,
          '🚀 Weekly Tech Trends from K P Manoj',
          content
        );
        
        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      }

      setNewsletterStatus(`Newsletter sent! ✅ ${successCount} success, ❌ ${failCount} failed`);
    } catch (error) {
      setNewsletterStatus('Error sending newsletter: ' + error.message);
    }
    
    setSendingNewsletter(false);
  };

  const handleSendTestEmail = async () => {
    setSendingNewsletter(true);
    setNewsletterStatus('Sending test email to admin...');

    try {
      const latestArticles = articles.slice(0, 5);
      const content = generateNewsletterContent(latestArticles, true);
      
      const result = await sendNewsletterEmail(
        '018kpmanoj@gmail.com',
        '🧪 TEST: Weekly Tech Trends from K P Manoj',
        content
      );
      
      if (result.success) {
        setNewsletterStatus('✅ Test email sent to 018kpmanoj@gmail.com!');
      } else {
        setNewsletterStatus('❌ Failed to send test email: ' + result.error);
      }
    } catch (error) {
      setNewsletterStatus('Error: ' + error.message);
    }
    
    setSendingNewsletter(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FaShieldAlt className="text-6xl text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You don't have permission to view this page.</p>
        </div>
      </div>
    );
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
                Welcome, {user?.displayName || user?.email} • Monitor your website
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
            label="Registered Users"
            value={users.length}
            color="green"
          />
          <StatCard
            icon={<FaEye />}
            label="Page Views"
            value={stats.totalPageViews}
            color="purple"
          />
          <StatCard
            icon={<FaNewspaper />}
            label="Subscribers"
            value={stats.subscriberCount}
            color="orange"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {['overview', 'users', 'activities', 'newsletter', 'security'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Login Methods */}
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
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.googleLogins}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FaEnvelope className="text-blue-500" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Email</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.emailLogins}
                  </span>
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
                  <p className="text-sm text-green-600 dark:text-green-400">Unique Sessions</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.uniqueSessions}</p>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Users
              </h2>
              <div className="space-y-3">
                {users.slice(0, 5).map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg">
                    {u.photoURL ? (
                      <img src={u.photoURL} alt="" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {(u.email?.[0] || 'U').toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {u.displayName || u.email?.split('@')[0]}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {u.email}
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

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {u.photoURL ? (
                            <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {(u.email?.[0] || 'U').toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {u.displayName || 'Anonymous'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.loginCount || 1}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {u.lastLogin?.toLocaleDateString?.() || 'N/A'}
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

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Activities ({activities.length})
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

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6">
            {/* Newsletter Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaPaperPlane className="text-blue-500" /> Send Newsletter
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Send the weekly newsletter with the latest articles to all subscribers.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleSendTestEmail}
                  disabled={sendingNewsletter}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <FaBell /> Send Test Email
                </button>
                <button
                  onClick={handleSendNewsletter}
                  disabled={sendingNewsletter || subscribers.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <FaPaperPlane /> Send to All ({subscribers.length} subscribers)
                </button>
              </div>
              {newsletterStatus && (
                <div className={`mt-4 p-3 rounded-lg ${newsletterStatus.includes('✅') ? 'bg-green-100 text-green-700' : newsletterStatus.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  {newsletterStatus}
                </div>
              )}
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  <strong>Note:</strong> To enable email sending, set up EmailJS credentials in your environment variables:
                  <br />• NEXT_PUBLIC_EMAILJS_SERVICE_ID
                  <br />• NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
                  <br />• NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
                </p>
              </div>
            </div>

            {/* Subscribers List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Newsletter Subscribers ({subscribers.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
                {subscribers.map((sub) => (
                  <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <FaEnvelope className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{sub.email}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Subscribed: {sub.subscribedAt?.toLocaleDateString?.() || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                      Active
                    </span>
                  </div>
                ))}
                {subscribers.length === 0 && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No subscribers yet. Share your newsletter to get started!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
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
                  No failed login attempts 🎉
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
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
    newsletter_subscription: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    login_failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    google_login_failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    signup_failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };
  return colors[action] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
}
