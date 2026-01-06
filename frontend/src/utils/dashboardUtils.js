export const dashboardUtils = {
  /**
   * Calculate average visit duration (in seconds)
   */
  calculateAverageDurationSeconds: (visits) => {
    const completed = visits.filter(
      (v) => v.check_in_at && v.check_out_at
    );

    if (completed.length === 0) return 0;

    const totalSeconds = completed.reduce((sum, v) => {
      const start = new Date(v.check_in_at).getTime();
      const end = new Date(v.check_out_at).getTime();
      return sum + Math.max(0, Math.floor((end - start) / 1000));
    }, 0);

    return Math.floor(totalSeconds / completed.length);
  },

  /**
   * Format seconds → human readable
   */
  formatDuration: (seconds) => {
    if (!seconds || seconds <= 0) return "-";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m`;

    return `${seconds}s`;
  },

  /**
   * Active visits count
   */
  getActiveVisitsCount: (visits) =>
    visits.filter((v) => !v.check_out_at).length,

  /**
   * Most visited department (based on host name)
   */
  getMostVisitedDept: (visits, hosts) => {
    if (!visits.length || !hosts.length) return null;

    const hostDeptMap = {};
    hosts.forEach((h) => {
      if (h.full_name && h.department) {
        hostDeptMap[h.full_name] = h.department;
      }
    });

    const deptCounts = {};

    visits.forEach((v) => {
      const dept = hostDeptMap[v.host] || "Unknown";
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });

    return Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  },
};
