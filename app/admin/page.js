'use client'

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getActivities, getLoginStats, getPageViewStats } from '@/lib/activityTracker';
import { getSubscribers, getSubscriberCount, sendNewsletterEmail } from '@/lib/newsletter';
import { getVisitorAnalytics, getActiveVisitors } from '@/lib/visitorAnalytics';
import { getProductStats, getAllProductInterests, PRODUCTS } from '@/lib/productCatalog';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, firebaseConfigured } from '@/lib/firebase';
import { 
  FaUsers, FaChartLine, FaShieldAlt, FaEye, FaSignInAlt, 
  FaGoogle, FaEnvelope, FaExclamationTriangle,
  FaSync, FaPaperPlane, FaNewspaper, FaBell, FaSpinner,
  FaUserSecret, FaDesktop, FaMobile, FaTabletAlt,
  FaGlobe, FaChartBar, FaBook, FaShoppingCart, FaHeart,
  FaChrome, FaFirefox, FaSafari, FaEdge
} from 'react-icons/fa';

// Memoized Stat Card for performance
const StatCard = memo(function StatCard({ icon, label, value, color, subValue }) {
  const colors = { 
    blue: 'bg-blue-500', 
    green: 'bg-green-500', 
    purple: 'bg-purple-500', 
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
    cyan: 'bg-cyan-500',
    red: 'bg-red-500',
    indigo: 'bg-indigo-500'
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className={`p-2 rounded-lg ${colors[color]} text-white w-fit mb-2`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      {subValue && <p className="text-xs text-green-500 mt-1">{subValue}</p>}
    </div>
  );
});

// Memoized Card component
const Card = memo(function Card({ title, icon, children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {title && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          {icon}
          <h2 className="font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
});

// Browser icon helper
const BrowserIcon = ({ browser }) => {
  const icons = {
    Chrome: <FaChrome className="text-green-500" />,
    Firefox: <FaFirefox className="text-orange-500" />,
    Safari: <FaSafari className="text-blue-500" />,
    Edge: <FaEdge className="text-blue-600" />
  };
  return icons[browser] || <FaGlobe className="text-gray-500" />;
};

// Device icon helper
const DeviceIcon = ({ device }) => {
  const icons = {
    desktop: <FaDesktop className="text-blue-500" />,
    mobile: <FaMobile className="text-green-500" />,
    tablet: <FaTabletAlt className="text-purple-500" />
  };
  return icons[device] || <FaDesktop className="text-gray-500" />;
};

function getActivityColor(action) {
  const colors = {
    login: 'bg-green-100 text-green-700', 
    google_login: 'bg-red-100 text-red-700',
    email_login: 'bg-blue-100 text-blue-700', 
    signup: 'bg-purple-100 text-purple-700',
    logout: 'bg-gray-100 text-gray-700', 
    page_view: 'bg-cyan-100 text-cyan-700',
    newsletter_subscription: 'bg-pink-100 text-pink-700', 
    login_failed: 'bg-red-100 text-red-700'
  };
  return colors[action] || 'bg-gray-100 text-gray-700';
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  
  const [stats, setStats] = useState({
    totalLogins: 0, totalSignups: 0, googleLogins: 0, emailLogins: 0,
    uniqueUsers: 0, totalPageViews: 0, uniqueSessions: 0, subscriberCount: 0, pageBreakdown: {}
  });
  const [visitorStats, setVisitorStats] = useState({
    totalVisitors: 0, uniqueVisitors: 0, anonymousVisitors: 0, signedInVisitors: 0,
    signedInEmails: [], deviceBreakdown: {}, browserBreakdown: {}, dailyVisits: [], recentVisitors: []
  });
  const [productStats, setProductStats] = useState({ totalInterests: 0, byProduct: {} });
  const [productInterests, setProductInterests] = useState([]);
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState(7);
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const [activeVisitors, setActiveVisitors] = useState(0);

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
      const [loginStats, pageStats, recentActivities, subCount, subsList, visitorAnalytics, activeCount, prodStats, prodInterests] = await Promise.all([
        getLoginStats(dateRange),
        getPageViewStats(dateRange),
        getActivities(50),
        getSubscriberCount(),
        getSubscribers(),
        getVisitorAnalytics(dateRange),
        getActiveVisitors(),
        getProductStats(),
        getAllProductInterests()
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
      setVisitorStats(visitorAnalytics);
      setActiveVisitors(activeCount);
      setProductStats(prodStats);
      setProductInterests(prodInterests);
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

  // Auto-refresh active visitors every 30 seconds
  useEffect(() => {
    if (!isAdmin) return;
    const interval = setInterval(async () => {
      const count = await getActiveVisitors();
      setActiveVisitors(count);
    }, 30000);
    return () => clearInterval(interval);
  }, [isAdmin]);

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

  // Memoized calculations for performance
  const visitorBreakdownData = useMemo(() => {
    const { deviceBreakdown, browserBreakdown } = visitorStats;
    return { deviceBreakdown, browserBreakdown };
  }, [visitorStats]);

  const topPages = useMemo(() => {
    return Object.entries(stats.pageBreakdown || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [stats.pageBreakdown]);

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
            {/* Active visitors badge */}
            <div className="bg-green-500 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <span className="animate-pulse w-2 h-2 bg-white rounded-full"></span>
              {activeVisitors} active now
            </div>
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
        {/* Stats Cards - Optimized with memoization */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          <StatCard icon={<FaEye />} label="Total Visits" value={visitorStats.totalVisitors} color="blue" />
          <StatCard icon={<FaUsers />} label="Unique Visitors" value={visitorStats.uniqueVisitors} color="green" />
          <StatCard icon={<FaUserSecret />} label="Anonymous" value={visitorStats.anonymousVisitors} color="purple" />
          <StatCard icon={<FaSignInAlt />} label="Signed In" value={visitorStats.signedInVisitors} color="cyan" />
          <StatCard icon={<FaSignInAlt />} label="Total Logins" value={stats.totalLogins} color="indigo" />
          <StatCard icon={<FaNewspaper />} label="Subscribers" value={stats.subscriberCount} color="orange" />
          <StatCard icon={<FaHeart />} label="Product Interest" value={productStats.totalInterests} color="pink" />
          <StatCard icon={<FaUsers />} label="Registered" value={users.length} color="red" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {['overview', 'visitors', 'users', 'products', 'newsletter', 'activities', 'security'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize text-sm whitespace-nowrap ${
                activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            
            <Card title="Device Breakdown" icon={<FaDesktop className="text-purple-500" />}>
              <div className="space-y-2">
                {Object.entries(visitorBreakdownData.deviceBreakdown || {}).map(([device, count]) => (
                  <div key={device} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DeviceIcon device={device} />
                      <span className="capitalize text-gray-600 dark:text-gray-400">{device}</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(visitorBreakdownData.deviceBreakdown || {}).length === 0 && (
                  <p className="text-gray-500 text-center py-2">No data yet</p>
                )}
              </div>
            </Card>

            <Card title="Browser Breakdown" icon={<FaGlobe className="text-green-500" />}>
              <div className="space-y-2">
                {Object.entries(visitorBreakdownData.browserBreakdown || {}).map(([browser, count]) => (
                  <div key={browser} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BrowserIcon browser={browser} />
                      <span className="text-gray-600 dark:text-gray-400">{browser}</span>
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
                {Object.keys(visitorBreakdownData.browserBreakdown || {}).length === 0 && (
                  <p className="text-gray-500 text-center py-2">No data yet</p>
                )}
              </div>
            </Card>

            <Card title="Top Pages" icon={<FaEye className="text-cyan-500" />}>
              <div className="space-y-2">
                {topPages.map(([path, count]) => (
                  <div key={path} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate max-w-[180px]">{path === '/' ? 'Home' : path}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
                {topPages.length === 0 && (
                  <p className="text-gray-500 text-center py-2">No page views yet</p>
                )}
              </div>
            </Card>

            <Card title="Product Interest" icon={<FaShoppingCart className="text-pink-500" />} className="md:col-span-2">
              <div className="grid grid-cols-3 gap-4">
                {PRODUCTS.map(product => (
                  <div key={product.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                    <FaBook className="text-2xl text-purple-500 mx-auto mb-2" />
                    <p className="font-medium text-sm truncate">{product.title}</p>
                    <p className="text-2xl font-bold text-purple-600">{productStats.byProduct[product.id] || 0}</p>
                    <p className="text-xs text-gray-500">interested</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Visitors Tab */}
        {activeTab === 'visitors' && (
          <div className="space-y-6">
            {/* Daily Visits Chart */}
            <Card title="Daily Visits" icon={<FaChartBar className="text-blue-500" />}>
              <div className="h-48 flex items-end gap-2">
                {visitorStats.dailyVisits.map((day, idx) => {
                  const maxTotal = Math.max(...visitorStats.dailyVisits.map(d => d.total), 1);
                  const height = (day.total / maxTotal) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col items-stretch" style={{ height: '140px' }}>
                        <div className="flex-1"></div>
                        <div className="flex flex-col">
                          <div 
                            className="bg-purple-500 rounded-t"
                            style={{ height: `${(day.anonymous / maxTotal) * 140}px` }}
                            title={`Anonymous: ${day.anonymous}`}
                          ></div>
                          <div 
                            className="bg-blue-500 rounded-b"
                            style={{ height: `${(day.signedIn / maxTotal) * 140}px` }}
                            title={`Signed In: ${day.signedIn}`}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 mt-2">{day.date.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>Anonymous</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Signed In</span>
                </div>
              </div>
            </Card>

            {/* Signed In Users */}
            <Card title={`Signed In Visitors (${visitorStats.signedInEmails.length})`} icon={<FaEnvelope className="text-green-500" />}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-3 py-2 text-left">Email</th>
                      <th className="px-3 py-2 text-left">Visits</th>
                      <th className="px-3 py-2 text-left">Last Visit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {visitorStats.signedInEmails.slice(0, 20).map((visitor, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2">{visitor.email}</td>
                        <td className="px-3 py-2">{visitor.visits}</td>
                        <td className="px-3 py-2 text-gray-500">{visitor.lastVisit?.toLocaleDateString?.()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visitorStats.signedInEmails.length === 0 && (
                  <p className="p-4 text-center text-gray-500">No signed in visitors yet</p>
                )}
              </div>
            </Card>

            {/* Recent Visitors */}
            <Card title="Recent Visitors" icon={<FaUsers className="text-purple-500" />}>
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {visitorStats.recentVisitors.map((visitor, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {visitor.isAnonymous ? (
                        <FaUserSecret className="text-gray-400 text-lg" />
                      ) : (
                        <FaUsers className="text-green-500 text-lg" />
                      )}
                      <div>
                        <p className="font-medium">
                          {visitor.isAnonymous ? 'Anonymous Visitor' : (visitor.displayName || visitor.email)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {visitor.page} • {visitor.device} • {visitor.browser}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{visitor.lastSeen?.toLocaleString?.()}</span>
                  </div>
                ))}
                {visitorStats.recentVisitors.length === 0 && (
                  <p className="p-4 text-center text-gray-500">No visitors yet</p>
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
                    <th className="px-3 py-2 text-left">Login Count</th>
                    <th className="px-3 py-2 text-left">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-3 py-2">{u.displayName || 'Anonymous'}</td>
                      <td className="px-3 py-2 text-gray-500">{u.email}</td>
                      <td className="px-3 py-2">{u.loginCount || 1}</td>
                      <td className="px-3 py-2 text-gray-500">{u.lastLogin?.toLocaleDateString?.() || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="p-4 text-center text-gray-500">No users yet</p>}
            </div>
          </Card>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {PRODUCTS.map(product => (
                <Card key={product.id} title={product.title} icon={<FaBook className="text-purple-500" />}>
                  <div className="text-center py-4">
                    <p className="text-4xl font-bold text-purple-600 mb-2">{productStats.byProduct[product.id] || 0}</p>
                    <p className="text-gray-500">people interested</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
                </Card>
              ))}
            </div>

            <Card title={`All Product Interests (${productInterests.length})`} icon={<FaHeart className="text-pink-500" />}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-3 py-2 text-left">Email</th>
                      <th className="px-3 py-2 text-left">Product</th>
                      <th className="px-3 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {productInterests.slice(0, 50).map((interest, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2">{interest.email}</td>
                        <td className="px-3 py-2">{PRODUCTS.find(p => p.id === interest.productId)?.title || interest.productId}</td>
                        <td className="px-3 py-2 text-gray-500">{interest.registeredAt?.toLocaleDateString?.()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {productInterests.length === 0 && <p className="p-4 text-center text-gray-500">No interests yet</p>}
              </div>
            </Card>
          </div>
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
                    <p className="text-sm text-gray-400">Make sure Firestore rules allow writes.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <Card title={`Recent Activities (${activities.length})`}>
            <div className="max-h-[500px] overflow-y-auto space-y-2">
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

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card title="Security Overview" icon={<FaShieldAlt className="text-red-500" />}>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600">Rate Limiting</p>
                <p className="text-lg font-bold text-green-700">Active</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600">Security Headers</p>
                <p className="text-lg font-bold text-green-700">Enabled</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600">Input Validation</p>
                <p className="text-lg font-bold text-green-700">Active</p>
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
              <p className="text-gray-500 text-center py-4">No failed attempts</p>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
