'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getActivities, getLoginStats, getPageViewStats } from '@/lib/activityTracker';
import { getSubscribers, getSubscriberCount, sendNewsletterEmail } from '@/lib/newsletter';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, firebaseConfigured } from '@/lib/firebase';
import { 
  FaUsers, FaChartLine, FaShieldAlt, FaEye, FaSignInAlt, 
  FaGoogle, FaEnvelope, FaExclamationTriangle,
  FaSync, FaPaperPlane, FaNewspaper, FaBell, FaSpinner
} from 'react-icons/fa';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  
  const [stats, setStats] = useState({
    totalLogins: 0, totalSignups: 0, googleLogins: 0, emailLogins: 0,
    uniqueUsers: 0, totalPageViews: 0, uniqueSessions: 0, subscriberCount: 0, pageBreakdown: {}
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
    if (!loading && !user) router.push('/');
    else if (!loading && user && !isAdmin) router.push('/');
  }, [user, isAdmin, loading, router]);

  const fetchDashboardData = useCallback(async () => {
    if (!firebaseConfigured) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const [loginStats, pageStats, recentActivities, subCount, subsList] = await Promise.all([
        getLoginStats(dateRange),
        getPageViewStats(dateRange),
        getActivities(50),
        getSubscriberCount(),
        getSubscribers()
      ]);
      
      let usersData = [];
      if (db) {
        try {
          const usersSnapshot = await getDocs(
            query(collection(db, 'users'), orderBy('lastLogin', 'desc'), limit(50))
          );
          usersData = usersSnapshot.docs.map(doc => ({
            id: doc.id, ...doc.data(),
            lastLogin: doc.data().lastLogin?.toDate?.() || new Date(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date()
          }));
        } catch (e) { console.log('Users fetch error:', e); }
      }

      setStats({
        totalLogins: loginStats.totalLogins || 0,
        totalSignups: loginStats.totalSignups || 0,
        googleLogins: loginStats.googleLogins || 0,
        emailLogins: loginStats.emailLogins || 0,
        uniqueUsers: loginStats.uniqueUsers || 0,
        totalPageViews: pageStats.totalViews || 0,
        uniqueSessions: pageStats.uniqueSessions || 0,
        pageBreakdown: pageStats.pageBreakdown || {},
        subscriberCount: subCount || 0
      });
      setActivities(recentActivities || []);
      setUsers(usersData);
      setSubscribers(subsList || []);
    } catch (error) {
      console.error('Dashboard error:', error);
    }
    setIsLoading(false);
  }, [dateRange]);

  useEffect(() => {
    if (isAdmin) fetchDashboardData();
  }, [isAdmin, fetchDashboardData]);

  const handleSendTestEmail = async () => {
    setSendingNewsletter(true);
    setNewsletterStatus('Sending test email to 018kpmanoj@gmail.com...');
    try {
      const result = await sendNewsletterEmail('018kpmanoj@gmail.com');
      setNewsletterStatus(result.success ? '✅ Test email sent!' : `❌ ${result.message || result.error}`);
    } catch (error) {
      setNewsletterStatus('❌ ' + error.message);
    }
    setSendingNewsletter(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FaShieldAlt className="text-6xl text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaShieldAlt /> Admin Dashboard
            </h1>
            <p className="text-blue-100 text-sm">Welcome, {user?.displayName || user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm"
            >
              <option value={7} className="text-gray-900">Last 7 days</option>
              <option value={30} className="text-gray-900">Last 30 days</option>
              <option value={90} className="text-gray-900">Last 90 days</option>
            </select>
            <button onClick={fetchDashboardData} disabled={isLoading} className="p-2 bg-white/20 rounded-lg hover:bg-white/30">
              <FaSync className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={<FaSignInAlt />} label="Total Logins" value={stats.totalLogins} color="blue" />
          <StatCard icon={<FaUsers />} label="Users" value={users.length} color="green" />
          <StatCard icon={<FaEye />} label="Page Views" value={stats.totalPageViews} color="purple" />
          <StatCard icon={<FaNewspaper />} label="Subscribers" value={stats.subscriberCount} color="orange" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {['overview', 'users', 'activities', 'newsletter', 'security'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize text-sm ${
                activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card title="Login Methods" icon={<FaChartLine className="text-blue-500" />}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><FaGoogle className="text-red-500" /> Google</div>
                  <span className="text-xl font-bold">{stats.googleLogins}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><FaEnvelope className="text-blue-500" /> Email</div>
                  <span className="text-xl font-bold">{stats.emailLogins}</span>
                </div>
              </div>
            </Card>
            <Card title="Top Pages" icon={<FaEye className="text-purple-500" />}>
              <div className="space-y-2">
                {Object.entries(stats.pageBreakdown || {}).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([path, count]) => (
                  <div key={path} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate max-w-[150px]">{path === '/' ? 'Home' : path}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(stats.pageBreakdown || {}).length === 0 && (
                  <p className="text-gray-500 text-center py-2">No page views yet</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card title={`Registered Users (${users.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-3 py-2 text-left">User</th>
                    <th className="px-3 py-2 text-left">Email</th>
                    <th className="px-3 py-2 text-left">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-3 py-2">{u.displayName || 'Anonymous'}</td>
                      <td className="px-3 py-2 text-gray-500">{u.email}</td>
                      <td className="px-3 py-2 text-gray-500">{u.lastLogin?.toLocaleDateString?.() || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="p-4 text-center text-gray-500">No users yet</p>}
            </div>
          </Card>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <Card title={`Recent Activities (${activities.length})`}>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {activities.map((activity) => (
                <div key={activity.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-start">
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getActivityColor(activity.action)}`}>
                      {activity.action?.replace(/_/g, ' ')}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{activity.data?.email || activity.path}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.timestamp?.toLocaleString?.()}</span>
                </div>
              ))}
              {activities.length === 0 && <p className="p-4 text-center text-gray-500">No activities yet</p>}
            </div>
          </Card>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6">
            <Card title="Send Newsletter" icon={<FaPaperPlane className="text-blue-500" />}>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Send weekly newsletter with latest articles.</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleSendTestEmail} disabled={sendingNewsletter}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2">
                  {sendingNewsletter ? <FaSpinner className="animate-spin" /> : <FaBell />} Send Test Email
                </button>
                <button disabled={sendingNewsletter || subscribers.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  <FaPaperPlane /> Send to All ({subscribers.length})
                </button>
              </div>
              {newsletterStatus && (
                <div className={`mt-4 p-3 rounded-lg ${newsletterStatus.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {newsletterStatus}
                </div>
              )}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-400">
                <strong>Email Setup:</strong> Add <code>RESEND_API_KEY</code> to Netlify → Site Settings → Environment Variables. 
                Get free key at <a href="https://resend.com" target="_blank" rel="noopener" className="underline">resend.com</a>
              </div>
            </Card>
            <Card title={`Subscribers (${subscribers.length})`}>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {subscribers.map((sub) => (
                  <div key={sub.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-blue-500" />
                      <span>{sub.email}</span>
                    </div>
                    <span className="text-xs text-gray-400">{sub.subscribedAt?.toLocaleDateString?.()}</span>
                  </div>
                ))}
                {subscribers.length === 0 && (
                  <div className="p-4 text-center">
                    <p className="text-gray-500 mb-2">No subscribers yet</p>
                    <p className="text-sm text-gray-400">Make sure Firestore rules allow writes. Go to Firebase Console → Firestore → Rules</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card title="Security Overview" icon={<FaShieldAlt className="text-red-500" />}>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600">Rate Limiting</p>
                <p className="text-lg font-bold text-green-700">Active</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600">Security Headers</p>
                <p className="text-lg font-bold text-green-700">Enabled</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600">Admin Protection</p>
                <p className="text-lg font-bold text-green-700">Active</p>
              </div>
            </div>
            <h3 className="font-semibold mb-3">Failed Logins</h3>
            {activities.filter(a => a.action?.includes('failed')).slice(0, 5).map((a) => (
              <div key={a.id} className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg mb-2">
                <span className="flex items-center gap-2"><FaExclamationTriangle className="text-red-500" /> {a.data?.email || 'Unknown'}</span>
                <span className="text-sm text-gray-500">{a.timestamp?.toLocaleString?.()}</span>
              </div>
            ))}
            {activities.filter(a => a.action?.includes('failed')).length === 0 && (
              <p className="text-gray-500 text-center py-4">No failed attempts 🎉</p>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = { blue: 'bg-blue-500', green: 'bg-green-500', purple: 'bg-purple-500', orange: 'bg-orange-500' };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
      <div className={`p-2 rounded-lg ${colors[color]} text-white w-fit mb-2`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function Card({ title, icon, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
      {title && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          {icon}
          <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

function getActivityColor(action) {
  const colors = {
    login: 'bg-green-100 text-green-700', google_login: 'bg-red-100 text-red-700',
    email_login: 'bg-blue-100 text-blue-700', signup: 'bg-purple-100 text-purple-700',
    logout: 'bg-gray-100 text-gray-700', page_view: 'bg-cyan-100 text-cyan-700',
    newsletter_subscription: 'bg-pink-100 text-pink-700', login_failed: 'bg-red-100 text-red-700'
  };
  return colors[action] || 'bg-gray-100 text-gray-700';
}
