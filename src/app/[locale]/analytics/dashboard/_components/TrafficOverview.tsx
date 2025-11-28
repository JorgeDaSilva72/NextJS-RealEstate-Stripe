"use client";

import { Card, CardBody, CardHeader } from "@nextui-org/react";
import {
  UsersIcon,
  EyeIcon,
  ClockIcon,
  ChartBarIcon,
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

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const stats = [
    {
      label: "Active Users",
      value: totals.activeUsers.toLocaleString(),
      icon: UsersIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Sessions",
      value: totals.sessions.toLocaleString(),
      icon: ChartBarIcon,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Page Views",
      value: totals.pageViews.toLocaleString(),
      icon: EyeIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Avg. Session Duration",
      value: formatDuration(avgDuration),
      icon: ClockIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: "Bounce Rate",
      value: `${(bounceRate * 100).toFixed(1)}%`,
      icon: ChartBarIcon,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Daily trend chart would go here */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Daily Traffic Trend</h3>
        </CardHeader>
        <CardBody>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>Chart visualization would be implemented here</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

