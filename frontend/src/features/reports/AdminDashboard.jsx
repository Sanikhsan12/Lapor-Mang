import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../../shared/context/AuthContext';
import { ThemeContext } from '../../shared/context/ThemeContext';
import { fetchWrapper } from '../../shared/utils/fetchWrapper';
import { LogOut, Filter, Activity, Image as ImageIcon, CheckCircle, Clock, Phone, MessageSquare, Send, Sun, Moon, Users } from 'lucide-react';
import { io } from 'socket.io-client';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { user, logoutAuth } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [reports, setReports] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [socketStatus, setSocketStatus] = useState('connecting');
  const [onlineCount, setOnlineCount] = useState(0);

  // Track admin response inputs per report id
  const [responseInputs, setResponseInputs] = useState({});
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    fetchReports();

    const socket = io('http://localhost:5000');
    socket.on('connect', () => setSocketStatus('connected'));
    socket.on('disconnect', () => setSocketStatus('disconnected'));
    socket.on('online-count', (count) => setOnlineCount(count));
    
    socket.on('new-report', (report) => {
      setReports((prev) => [report, ...prev]);
      if (Notification.permission === 'granted') {
        new Notification('New Lapor Mang Report!', { body: report.title });
      }
    });

    socket.on('status-update', (updatedReport) => {
      setReports((prev) => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
    });

    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    return () => socket.disconnect();
  }, []);

  const fetchReports = async (query = '') => {
    try {
      const res = await fetchWrapper.get(`/reports${query}`);
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    if (filterType === 'all') {
      fetchReports();
      return;
    }
    let q = '?';
    if (filterType === 'date') q += `date=${filterValue}`;
    else if (filterType === 'month') {
      const parts = filterValue.split('-');
      q += `year=${parts[0]}&month=${parts[1]}`;
    }
    else if (filterType === 'year') q += `year=${filterValue}`;
    fetchReports(q);
  };

  const updateStatus = async (id, status) => {
    try {
      await fetchWrapper.put(`/reports/${id}/status`, { status });
    } catch (err) {
      alert(err.toString());
    }
  };

  const sendResponse = async (id) => {
    const text = responseInputs[id] || '';
    if (!text.trim()) return;
    setSendingId(id);
    try {
      const report = reports.find(r => r.id === id);
      await fetchWrapper.put(`/reports/${id}/status`, {
        status: report.status,
        adminResponse: text.trim(),
      });
      // Clear input after send
      setResponseInputs(prev => ({ ...prev, [id]: '' }));
    } catch (err) {
      alert(err.toString());
    } finally {
      setSendingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'under investigation': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
    }
  };

  const stats = useMemo(() => {
    const total = reports.length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    const pending = reports.filter(r => r.status === 'pending').length;
    return { total, resolved, pending };
  }, [reports]);

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark pt-8 px-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
              Admin Portal
              <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-bold ${socketStatus === 'connected' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                <Activity size={14} className={socketStatus === 'connected' ? 'animate-pulse' : ''} /> {socketStatus}
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Lapor Mang — Live Reports Monitoring &amp; Management</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={logoutAuth} className="flex items-center gap-2 text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg font-medium transition-colors">
              <LogOut size={20} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="card-surface flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-xl dark:bg-blue-900/30 dark:text-blue-400"><Activity size={28}/></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Reports Handled</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.total}</p>
            </div>
          </div>
          <div className="card-surface flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="bg-yellow-100 text-yellow-600 p-4 rounded-xl dark:bg-yellow-900/30 dark:text-yellow-400"><Clock size={28}/></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Pending Actions Required</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.pending}</p>
            </div>
          </div>
          <div className="card-surface flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="bg-green-100 text-green-600 p-4 rounded-xl dark:bg-green-900/30 dark:text-green-400"><CheckCircle size={28}/></div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Successfully Resolved</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{stats.resolved}</p>
            </div>
          </div>
          <div className="card-surface flex items-center gap-4 hover:-translate-y-1 transition-transform col-span-1 md:col-span-3 lg:col-span-1">
            <div className="bg-teal-100 text-teal-600 p-4 rounded-xl dark:bg-teal-900/30 dark:text-teal-400 relative">
              <Users size={28}/>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">User Online Sekarang</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">{onlineCount}</p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="card-surface">
          <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Filter Overview By</label>
              <select 
                className="input-field" 
                value={filterType} 
                onChange={(e) => { setFilterType(e.target.value); setFilterValue(''); }}
              >
                <option value="all">Global (All Time)</option>
                <option value="date">Daily (Specific Date)</option>
                <option value="month">Monthly Overview</option>
                <option value="year">Yearly Overview</option>
              </select>
            </div>
            {filterType !== 'all' && (
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Select Timeline</label>
                {filterType === 'date' && <input type="date" className="input-field" value={filterValue} onChange={e => setFilterValue(e.target.value)} required />}
                {filterType === 'month' && <input type="month" className="input-field" value={filterValue} onChange={e => setFilterValue(e.target.value)} required />}
                {filterType === 'year' && <input type="number" min="2000" max="2100" placeholder="e.g. 2024" className="input-field" value={filterValue} onChange={e => setFilterValue(e.target.value)} required />}
              </div>
            )}
            <button type="submit" className="btn-secondary flex items-center justify-center gap-2 py-2.5 w-full sm:w-auto px-6">
              <Filter size={20} /> Apply Filter
            </button>
          </form>
        </div>

        {/* Reports List (Card-based for more detail space) */}
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="card-surface text-center py-12 text-slate-500 dark:text-slate-400 font-medium">
              No reports found matching your criteria
            </div>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="card-surface overflow-hidden p-0">
                {/* Top row */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Left — report info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-wider border ${getStatusColor(r.status)} whitespace-nowrap`}>
                        {r.status}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{format(new Date(r.createdAt), 'dd MMM yyyy, HH:mm')}</span>
                      <span className="text-xs font-bold text-primary">@{r.user.username}</span>
                      {r.phone && (
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          <Phone size={11} /> {r.phone}
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-slate-800 dark:text-white text-base mb-1 truncate">{r.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{r.description}</p>
                    <a
                      href={`http://localhost:5000${r.photoUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded transition-colors text-slate-700 dark:text-slate-300 font-medium"
                    >
                      <ImageIcon size={14} /> View Media
                    </a>
                  </div>

                  {/* Right — status selector */}
                  <div className="shrink-0">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Ubah Status</label>
                    <select 
                      className="text-sm font-medium border-2 border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer w-full"
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="under investigation">Investigating</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                {/* Admin Response Area */}
                <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare size={15} className="text-primary" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Balasan Admin</span>
                  </div>

                  {/* Existing response */}
                  {r.adminResponse && (
                    <div className="mb-3 p-3 bg-primary/5 border border-primary/20 rounded-lg text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      <span className="text-xs text-primary font-bold block mb-1">Balasan terkirim:</span>
                      {r.adminResponse}
                    </div>
                  )}

                  {/* Input for new/updated response */}
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      className="input-field flex-1 text-sm resize-none py-2"
                      placeholder={r.adminResponse ? 'Perbarui balasan...' : 'Tulis balasan untuk pelapor...'}
                      value={responseInputs[r.id] || ''}
                      onChange={(e) => setResponseInputs(prev => ({ ...prev, [r.id]: e.target.value }))}
                    />
                    <button
                      disabled={sendingId === r.id || !responseInputs[r.id]?.trim()}
                      onClick={() => sendResponse(r.id)}
                      className="btn-primary px-4 py-2 flex items-center gap-2 self-end text-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <Send size={15} />
                      {sendingId === r.id ? 'Sending...' : 'Kirim'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
