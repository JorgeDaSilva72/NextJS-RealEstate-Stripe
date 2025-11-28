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

export default function TrafficOverview({
  data,
  dateRange,
}: TrafficOverviewProps) {
  // Parse GA4 response
  const rows = data?.rows || [];
  
  // Calculate totals
  const totals = rows.reduce(
    (acc: any, row: any) => {
      const metrics = row.metricValues || [];
      acc.activeUsers += parseInt(metrics[0]?.value || "0");
      acc.sessions += parseInt(metrics[1]?.value || "0");
      acc.pageViews += parseInt(metrics[2]?.value || "0");
      acc.avgDuration += parseFloat(metrics[3]?.value || "0");
      acc.bounceRate += parseFloat(metrics[4]?.value || "0");
      return acc;
    },
    {
      activeUsers: 0,
      sessions: 0,
      pageViews: 0,
      avgDuration: 0,
      bounceRate: 0,
    }
  );

  const avgDuration = totals.avgDuration / rows.length || 0;
  const bounceRate = totals.bounceRate / rows.length || 0;
  const avgSessionDuration = avgDuration;
  const pagesPerSession = totals.sessions > 0 ? (totals.pageViews / totals.sessions).toFixed(2) : "0";

  // Format duration
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  // Daily data for chart
  const dailyData = rows.map((row: any) => {
    const dimensions = row.dimensionValues || [];
    const metrics = row.metricValues || [];
    return {
      date: dimensions[0]?.value || "",
      users: parseInt(metrics[0]?.value || "0"),
      sessions: parseInt(metrics[1]?.value || "0"),
      pageViews: parseInt(metrics[2]?.value || "0"),
    };
  });

  interface DailyData {
    date: string;
    users: number;
    sessions: number;
    pageViews: number;
    avgDuration: number;
    bounceRate: number;
  }

  const maxUsers = Math.max(...dailyData.map((d: DailyData) => d.users), 1);
  const maxSessions = Math.max(...dailyData.map((d: DailyData) => d.sessions), 1);
  const maxPageViews = Math.max(...dailyData.map((d: DailyData) => d.pageViews), 1);

  const stats = [
    {
      label: "Active Users",
      value: totals.activeUsers.toLocaleString(),
      icon: UsersIcon,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      description: "Unique visitors",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Sessions",
      value: totals.sessions.toLocaleString(),
      icon: ChartBarIcon,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      description: "Total sessions",
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "Page Views",
      value: totals.pageViews.toLocaleString(),
      icon: EyeIcon,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      description: "Total page views",
      trend: "+15%",
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
          {dailyData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>No data available for the selected period</p>
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
