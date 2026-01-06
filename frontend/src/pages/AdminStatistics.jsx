import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import {
  VisitorTrendsChart,
  VisitDurationChart,
  VisitStatusChart,
  PeakHoursChart,
  TopDepartmentsChart,
  StatCardWithIndicator,
} from "../components/DashboardCharts";
import { dashboardUtils } from "../utils/dashboardUtils";

const StatCard = ({ title, value, max, color }) => (
  <div className={`rounded-xl shadow p-4 ${
    color === "blue" ? "bg-blue-50" : color === "green" ? "bg-green-50" : "bg-white"
  }`}>
    <p className="text-sm text-gray-600 font-medium">{title}</p>
    <p className={`text-3xl font-bold mt-2 ${color === "blue" ? "text-blue-600" : color === "green" ? "text-green-600" : "text-gray-800"}`}>
      {value}
    </p>
    {max && (
      <div className="text-xs text-gray-500 mt-1">{Math.round((value / max) * 100)}% of {max}</div>
    )}
  </div>
);

export default function AdminStatistics() {
  const [stats, setStats] = useState(null);
  const [visits, setVisits] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const resStats = await adminApi.getDashboard();
        const resVisits = await adminApi.getVisits();
        const resHosts = await adminApi.getHosts();
        setStats(resStats.data.data.stats);
        setVisits(resVisits.data.data);
        setHosts(resHosts.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="text-center">Loading statistics...</div>;

  const avgSeconds = dashboardUtils.calculateAverageDurationSeconds(visits);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Visitors Today" value={stats?.visitors_today || 0} color="blue" />
        <StatCard
            title="Average Visit Duration"
            value={dashboardUtils.formatDuration(avgSeconds)}
            color="green"
        />
        <StatCard title="Active Visits" value={dashboardUtils.getActiveVisitsCount(visits)} max={visits.length || 1} color="blue" />
        <StatCard title="Total Visits" value={visits.length} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitorTrendsChart visits={visits} />
        <VisitStatusChart visits={visits} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitDurationChart visits={visits} />
        <PeakHoursChart visits={visits} />
      </div>

      <TopDepartmentsChart visits={visits} hosts={hosts} />
    </div>
  );
}
