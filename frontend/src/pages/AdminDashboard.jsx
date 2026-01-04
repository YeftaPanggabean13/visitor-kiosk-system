import React, { useEffect, useMemo, useState } from 'react';
import mockApi from '../services/mockApi';

function StatCard({ label, value, hint }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [visitors, setVisitors] = useState([]);
  const [hostsMap, setHostsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const [vRes, hRes] = await Promise.all([mockApi.getCurrentVisitors(), mockApi.getHosts()]);
      if (!mounted) return;
      if (vRes.success) setVisitors(vRes.data);
      if (hRes.success) {
        const map = {};
        hRes.data.forEach((h) => (map[h.id] = h.name));
        setHostsMap(map);
      }
      setLoading(false);
    };
    load();
    return () => (mounted = false);
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const isToday = (iso) => {
      if (!iso) return false;
      const d = new Date(iso);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    };

    const visitorsToday = visitors.filter((v) => isToday(v.checkedInAt)).length;
    const activeVisitors = visitors.filter((v) => v.status === 'inside').length;

    // Compute average duration for checked-out visitors; placeholder if none
    const durations = visitors
      .filter((v) => v.checkedOutAt)
      .map((v) => {
        return Math.max(0, new Date(v.checkedOutAt) - new Date(v.checkedInAt));
      });
    const avgMs = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null;

    const formatMs = (ms) => {
      if (!ms) return '—';
      const s = Math.floor(ms / 1000);
      const m = Math.floor(s / 60) % 60;
      const h = Math.floor(s / 3600);
      return `${h}h ${m}m`;
    };

    return {
      visitorsToday,
      activeVisitors,
      avgVisitDuration: avgMs ? formatMs(avgMs) : 'N/A',
    };
  }, [visitors]);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500">Overview of visitor activity and recent history</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg">Filters</button>
            <div className="relative">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium">Export</button>
              <div className="absolute -right-2 -bottom-2 text-xs text-slate-400">CSV</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Visitors today" value={loading ? '…' : stats.visitorsToday} hint="Unique check-ins since midnight" />
          <StatCard label="Active visitors" value={loading ? '…' : stats.activeVisitors} hint="Currently inside the building" />
          <StatCard label="Average visit duration" value={loading ? '…' : stats.avgVisitDuration} hint="Calculated from completed visits (placeholder)" />
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-slate-800">Visitor history</h2>
            <div className="text-sm text-slate-500">Showing recent check-ins (mock data)</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500">Host</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500">Check-in</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500">Check-out</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500">Duration</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">Loading…</td>
                  </tr>
                )}

                {!loading && visitors.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">No recent visitors</td>
                  </tr>
                )}

                {!loading && visitors.map((v) => {
                  const checkIn = v.checkedInAt ? new Date(v.checkedInAt).toLocaleString() : '—';
                  const checkOut = v.checkedOutAt ? new Date(v.checkedOutAt).toLocaleString() : '—';
                  const duration = v.checkedOutAt ? (() => {
                    const ms = new Date(v.checkedOutAt) - new Date(v.checkedInAt);
                    const mins = Math.round(ms / 60000);
                    return `${mins}m`;
                  })() : '—';
                  return (
                    <tr key={v.checkInId} className="border-b hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">{v.name}</div>
                        <div className="text-xs text-slate-500">{v.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{v.company || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{hostsMap[v.hostToVisit] || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{checkIn}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{checkOut}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{duration}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${v.status === 'inside' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {v.status === 'inside' ? 'Inside' : 'Checked out'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
