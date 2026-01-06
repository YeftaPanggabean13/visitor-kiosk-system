/**
 * Dashboard data transformation utilities
 * Prepares raw API data for visualization components
 */

export const dashboardUtils = {
  /**
   * Calculate average visit duration in minutes
   */
  calculateAverageDuration: (visits) => {
    if (visits.length === 0) return 0;

    const validVisits = visits.filter((v) => v.duration !== null && v.duration !== undefined);
    if (validVisits.length === 0) return 0;

    const total = validVisits.reduce((sum, v) => sum + v.duration, 0);
    return Math.round(total / validVisits.length);
  },

  /**
   * Get active visits count
   */
  getActiveVisitsCount: (visits) => {
    return visits.filter((v) => !v.check_out_at).length;
  },

  /**
   * Get completed visits count
   */
  getCompletedVisitsCount: (visits) => {
    return visits.filter((v) => v.check_out_at).length;
  },

  /**
   * Get peak hour (hour with most visitors)
   */
  getPeakHour: (visits) => {
    if (visits.length === 0) return null;

    const hourCounts = new Array(24).fill(0);
    visits.forEach((visit) => {
      const hour = new Date(visit.check_in_at).getHours();
      hourCounts[hour]++;
    });

    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    return peakHour;
  },

  /**
   * Get most visited department
   */
  getMostVisitedDept: (visits, hosts) => {
    if (visits.length === 0 || hosts.length === 0) return null;

    const hostDeptMap = {};
    hosts.forEach((host) => {
      hostDeptMap[host.id] = host.department;
    });

    const deptCounts = {};
    visits.forEach((visit) => {
      const dept = hostDeptMap[visit.host_id] || "Unknown";
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });

    let maxDept = null;
    let maxCount = 0;
    Object.entries(deptCounts).forEach(([dept, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxDept = dept;
      }
    });

    return maxDept;
  },

  /**
   * Get total unique visitors
   */
  getUniqueVisitorsCount: (visits) => {
    const uniqueVisitors = new Set(visits.map((v) => v.visitor_id || v.visitor));
    return uniqueVisitors.size;
  },

  /**
   * Get visit count for a specific date
   */
  getVisitsForDate: (visits, date) => {
    return visits.filter(
      (v) => new Date(v.check_in_at).toDateString() === new Date(date).toDateString()
    ).length;
  },

  /**
   * Format duration in human-readable format
   */
  formatDuration: (minutes) => {
    if (!minutes || minutes < 0) return "-";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  },
};
