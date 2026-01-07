import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Color palette for consistent branding
const COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",
  light: "#f3f4f6",
};

const CHART_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

/* Visitor Trends Line Chart */
export const VisitorTrendsChart = ({ visits }) => {
  // Group visits by date
  const trendData = visits.reduce((acc, visit) => {
    const date = new Date(visit.check_in_at).toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
    });

    const existing = acc.find((item) => item.date === date);
    if (existing) {
      existing.visitors += 1;
    } else {
      acc.push({ date, visitors: 1 });
    }
    return acc;
  }, []);

  // Keep only last 7 entries for clarity
  const displayData = trendData.slice(-7);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Visitor Trends (Last 7 Days)</h3>
      {displayData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={displayData}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: `2px solid ${COLORS.primary}`,
                borderRadius: "8px",
              }}
              formatter={(value) => [`${value} visitors`, "Count"]}
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke={COLORS.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorVisitors)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-8">No data available</p>
      )}
    </div>
  );
};

/* Visit Duration Distribution Bar Chart */
export const VisitDurationChart = ({ visits }) => {
  // Categorize visits by duration
  const durationCategories = {
    "< 15 min": 0,
    "15-30 min": 0,
    "30-60 min": 0,
    "1-2 hours": 0,
    "> 2 hours": 0,
  };

  visits.forEach((visit) => {
    if (visit.duration === null || visit.duration === undefined) return;

    const duration = visit.duration; // in minutes
    if (duration < 15) durationCategories["< 15 min"]++;
    else if (duration < 30) durationCategories["15-30 min"]++;
    else if (duration < 60) durationCategories["30-60 min"]++;
    else if (duration < 120) durationCategories["1-2 hours"]++;
    else durationCategories["> 2 hours"]++;
  });

  const data = Object.entries(durationCategories).map(([category, count]) => ({
    category,
    count,
  }));

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Visit Duration Distribution</h3>
      {data.some((item) => item.count > 0) ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="category" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: `2px solid ${COLORS.secondary}`,
                borderRadius: "8px",
              }}
              formatter={(value) => [`${value} visits`, "Count"]}
            />
            <Bar dataKey="count" fill={COLORS.secondary} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-8">No data available</p>
      )}
    </div>
  );
};

/* Active vs Completed Visits Pie Chart */
export const VisitStatusChart = ({ visits }) => {
  const active = visits.filter((v) => !v.check_out_at).length;
  const completed = visits.filter((v) => v.check_out_at).length;

  const data = [
    { name: "Completed", value: completed },
    { name: "Active", value: active },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Visit Status Overview</h3>
      {visits.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              <Cell fill={COLORS.success} />
              <Cell fill={COLORS.warning} />
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} visits`, "Count"]}
              contentStyle={{
                backgroundColor: "#fff",
                border: `2px solid ${COLORS.success}`,
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-8">No data available</p>
      )}
    </div>
  );
};

/* Peak Hours Bar Chart */
export const PeakHoursChart = ({ visits }) => {
  // Extract hour from check-in time
  const hourDistribution = new Array(24).fill(0);

  visits.forEach((visit) => {
    const hour = new Date(visit.check_in_at).getHours();
    hourDistribution[hour]++;
  });

  // Create data for chart (group by 2-hour intervals for clarity)
  const data = [];
  for (let i = 0; i < 24; i += 2) {
    const startHour = i;
    const endHour = i + 2;
    const count = hourDistribution[i] + hourDistribution[i + 1];
    data.push({
      period: `${startHour}:00 - ${endHour}:00`,
      visitors: count,
    });
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Peak Visit Hours</h3>
      {visits.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" angle={-45} textAnchor="end" height={80} stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: `2px solid ${COLORS.danger}`,
                borderRadius: "8px",
              }}
              formatter={(value) => [`${value} visitors`, "Count"]}
            />
            <Bar dataKey="visitors" fill={COLORS.danger} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-8">No data available</p>
      )}
    </div>
  );
};

/* Enhanced Stat Card with Progress Ring */
export const StatCardWithIndicator = ({ title, value, max, icon: Icon, color = "blue" }) => {
  const percentage = max ? (value / max) * 100 : 0;
  const colorClass = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    red: "text-red-600",
  }[color];

  const bgColorClass = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
    red: "bg-red-50",
  }[color];

  return (
    <div className={`${bgColorClass} rounded-xl shadow p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className={`text-3xl font-bold ${colorClass} mt-2`}>{value}</p>
          {max && (
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(percentage)}% of {max}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`${colorClass} opacity-20`}>
            <Icon size={48} />
          </div>
        )}
      </div>
      {max && (
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div
            className={`h-full rounded-full transition-all duration-300`}
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: `#${color === "blue" ? "3b82f6" : color === "green" ? "10b981" : color === "purple" ? "8b5cf6" : "ef4444"}`,
            }}
          />
        </div>
      )}
    </div>
  );
};

/* Top Departments Bar Chart */
export const TopDepartmentsChart = ({ visits, hosts }) => {
  if (visits.length === 0 || hosts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Top Visiting Departments</h3>
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    );
  }

  // Create a map of host_id to department
  const hostDeptMap = {};
  hosts.forEach((host) => {
    hostDeptMap[host.id] = host.department;
  });

  // Count visits by department
  const deptCounts = {};
  visits.forEach((visit) => {
    const dept = visit.host?.department || "Unknown";
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  });

  // Convert to array and sort
  const data = Object.entries(deptCounts)
    .map(([dept, count]) => ({ dept, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Top Visiting Departments</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 200 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" />
          <YAxis dataKey="dept" type="category" stroke="#6b7280" width={190} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: `2px solid ${COLORS.primary}`,
              borderRadius: "8px",
            }}
            formatter={(value) => [`${value} visits`, "Count"]}
          />
          <Bar dataKey="count" fill={COLORS.primary} radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
