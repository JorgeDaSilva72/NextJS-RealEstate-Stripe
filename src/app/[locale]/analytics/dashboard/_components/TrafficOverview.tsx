"use client";

import { Card, CardBody, CardHeader, Progress } from "@nextui-org/react";
import {
  UsersIcon,
  EyeIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

interface TrafficOverviewProps {
  data: any;
  dateRange: { start: string; end: string };
}

interface DailyData {
  date: string;
  users: number;
  sessions: number;
  pageViews: number;
}

export default function TrafficOverview({
  data,
  dateRange,
}: TrafficOverviewProps) {
  // Parse GA4 response - handle both direct data and nested data structure
  const responseData = data?.data || data;
  const rows = responseData?.rows || [];
  
  // Calculate totals - handle both aggregated and daily data
  const totals = rows.reduce(
    (acc: any, row: any) => {
      const metrics = row.metricValues || [];
      // Handle different metric orders and ensure we parse correctly
      const activeUsers = parseFloat(metrics[0]?.value || "0") || 0;
      const sessions = parseFloat(metrics[1]?.value || "0") || 0;
      const pageViews = parseFloat(metrics[2]?.value || "0") || 0;
      const avgDuration = parseFloat(metrics[3]?.value || "0") || 0;
      const bounceRate = parseFloat(metrics[4]?.value || "0") || 0;
      
      acc.activeUsers += activeUsers;
      acc.sessions += sessions;
      acc.pageViews += pageViews;
      acc.avgDuration += avgDuration;
      acc.bounceRate += bounceRate;
      acc.count += 1;
      return acc;
    },
    {
      activeUsers: 0,
      sessions: 0,
      pageViews: 0,
      avgDuration: 0,
      bounceRate: 0,
      count: 0,
    }
  );

  // Calculate averages properly
  const avgDuration = totals.count > 0 ? totals.avgDuration / totals.count : 0;
  const bounceRate = totals.count > 0 ? totals.bounceRate / totals.count : 0;
  const avgSessionDuration = avgDuration;
  const pagesPerSession = totals.sessions > 0 ? (totals.pageViews / totals.sessions).toFixed(2) : "0";
  
  // Also check for rowCount - if we have data but no rows, it might be aggregated differently
  const rowCount = responseData?.rowCount || rows.length;

  // Format duration
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  // Daily data for chart - handle date formatting
  const dailyData: DailyData[] = rows.map((row: any) => {
    const dimensions = row.dimensionValues || [];
    const metrics = row.metricValues || [];
    let dateValue = dimensions[0]?.value || "";
    
    // Format date if it's in YYYYMMDD format
    if (dateValue && dateValue.length === 8 && /^\d+$/.test(dateValue)) {
      const year = dateValue.substring(0, 4);
      const month = dateValue.substring(4, 6);
      const day = dateValue.substring(6, 8);
      dateValue = `${year}-${month}-${day}`;
    }
    
    return {
      date: dateValue,
      users: parseFloat(metrics[0]?.value || "0") || 0,
      sessions: parseFloat(metrics[1]?.value || "0") || 0,
      pageViews: parseFloat(metrics[2]?.value || "0") || 0,
    };
  });

  const maxUsers = Math.max(...dailyData.map((d: DailyData) => d.users), totals.activeUsers || 1);
  const maxSessions = Math.max(...dailyData.map((d: DailyData) => d.sessions), totals.sessions || 1);
  const maxPageViews = Math.max(...dailyData.map((d: DailyData) => d.pageViews), totals.pageViews || 1);

  const stats = [
    {
      label: "Active Users",
      value: totals.activeUsers > 0 ? totals.activeUsers.toLocaleString() : "0",
      icon: UsersIcon,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      description: "Unique Visitors",
      trend: rowCount > 0 ? "+0%" : "N/A",
      trendUp: true,
    },
    {
      label: "Sessions",
      value: totals.sessions > 0 ? totals.sessions.toLocaleString() : "0",
      icon: ChartBarIcon,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      description: "Total sessions",
      trend: rowCount > 0 ? "+0%" : "N/A",
      trendUp: true,
    },
    {
      label: "Page Views",
      value: totals.pageViews > 0 ? totals.pageViews.toLocaleString() : "0",
      icon: EyeIcon,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      description: "Total page views",
      trend: rowCount > 0 ? "+0%" : "N/A",
      trendUp: true,
    },
    {
      label: "Avg. Session Duration",
      value: formatDuration(avgSessionDuration),
      icon: ClockIcon,
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50",
      borderColor: "border-orange-200",
      description: "Time on site",
      trend: "+5%",
      trendUp: true,
    },
    {
      label: "Bounce Rate",
      value: `${(bounceRate * 100).toFixed(1)}%`,
      icon: ChartBarIcon,
      gradient: "from-red-500 to-rose-500",
      bgGradient: "from-red-50 to-rose-50",
      borderColor: "border-red-200",
      description: "Single-page sessions",
      trend: "-3%",
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={index}
            className="border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            style={{ borderColor: stat.borderColor.replace('border-', '') }}
          >
            <CardBody className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-md`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {stat.trendUp ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`font-semibold ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  {stat.label}
                </p>
                <p className="text-xs text-gray-500">
                  {stat.description}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-gray-200 shadow-md">
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pages per Session</p>
                <p className="text-2xl font-bold text-gray-800">{pagesPerSession}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-gray-200 shadow-md">
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Pages per User</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totals.activeUsers > 0 
                    ? (totals.pageViews / totals.activeUsers).toFixed(2) 
                    : "0"}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <EyeIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-gray-200 shadow-md">
          <CardBody className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Session Duration</p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatDuration(avgSessionDuration)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Daily Trend Chart */}
      <Card className="border border-gray-200 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-bold text-gray-800">Daily Traffic Trend</h3>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600">Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-gray-600">Page Views</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-6">
          {dailyData.length === 0 && totals.activeUsers === 0 && totals.sessions === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <ChartBarIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium">No data available for the selected period</p>
                <p className="text-sm text-gray-400 mt-2">Try selecting a different date range</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Chart Visualization */}
              <div className="h-64 flex items-end justify-between gap-1">
                {dailyData.slice(-14).map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full flex flex-col items-center gap-0.5 relative">
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                        <div>{day.date}</div>
                        <div>Users: {day.users}</div>
                        <div>Sessions: {day.sessions}</div>
                        <div>Views: {day.pageViews}</div>
                      </div>
                      
                      {/* Bars */}
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:opacity-80"
                        style={{ height: `${(day.users / maxUsers) * 100}%`, minHeight: '4px' }}
                        title={`Users: ${day.users}`}
                      ></div>
                      <div 
                        className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all hover:opacity-80"
                        style={{ height: `${(day.sessions / maxSessions) * 100}%`, minHeight: '4px' }}
                        title={`Sessions: ${day.sessions}`}
                      ></div>
                      <div 
                        className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t transition-all hover:opacity-80"
                        style={{ height: `${(day.pageViews / maxPageViews) * 100}%`, minHeight: '4px' }}
                        title={`Page Views: ${day.pageViews}`}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 transform -rotate-45 origin-top-left mt-8 whitespace-nowrap">
                      {day.date?.split('-').slice(1).join('/') || ''}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Peak Users</p>
                  <p className="text-lg font-bold text-gray-800">
                    {Math.max(...dailyData.map((d: DailyData) => d.users), 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Peak Sessions</p>
                  <p className="text-lg font-bold text-gray-800">
                    {Math.max(...dailyData.map((d: DailyData) => d.sessions), 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Peak Page Views</p>
                  <p className="text-lg font-bold text-gray-800">
                    {Math.max(...dailyData.map((d: DailyData) => d.pageViews), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
