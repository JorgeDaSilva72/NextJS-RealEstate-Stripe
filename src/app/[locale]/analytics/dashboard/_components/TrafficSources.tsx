"use client";

import { 
  Card, 
  CardBody, 
  CardHeader, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Chip,
  Progress
} from "@nextui-org/react";
import {
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  ShareIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface TrafficSourcesProps {
  data: any;
}

export default function TrafficSources({ data }: TrafficSourcesProps) {
  const rows = data?.rows || [];

  const sources = rows.map((row: any) => {
    const dimensions = row.dimensionValues || [];
    const metrics = row.metricValues || [];
    return {
      source: dimensions[0]?.value || "(direct)",
      medium: dimensions[1]?.value || "(none)",
      sessions: parseInt(metrics[0]?.value || "0"),
      users: parseInt(metrics[1]?.value || "0"),
      pageViews: parseInt(metrics[2]?.value || "0"),
    };
  });

  const totalSessions = sources.reduce((sum, s) => sum + s.sessions, 0);
  const maxSessions = Math.max(...sources.map(s => s.sessions), 1);

  const getSourceIcon = (source: string, medium: string) => {
    const sourceLower = source.toLowerCase();
    const mediumLower = medium.toLowerCase();
    
    if (sourceLower === "(direct)" || sourceLower.includes("direct")) {
      return LinkIcon;
    } else if (sourceLower.includes("google") || mediumLower.includes("organic")) {
      return MagnifyingGlassIcon;
    } else if (mediumLower.includes("social") || sourceLower.includes("facebook") || sourceLower.includes("twitter")) {
      return ShareIcon;
    }
    return ArrowTopRightOnSquareIcon;
  };

  const getSourceColor = (source: string, medium: string) => {
    const sourceLower = source.toLowerCase();
    const mediumLower = medium.toLowerCase();
    
    if (sourceLower === "(direct)" || sourceLower.includes("direct")) {
      return "from-gray-500 to-gray-600";
    } else if (sourceLower.includes("google") || mediumLower.includes("organic")) {
      return "from-blue-500 to-cyan-500";
    } else if (mediumLower.includes("social")) {
      return "from-purple-500 to-pink-500";
    } else if (mediumLower.includes("email")) {
      return "from-green-500 to-emerald-500";
    } else if (mediumLower.includes("cpc") || mediumLower.includes("paid")) {
      return "from-orange-500 to-red-500";
    }
    return "from-indigo-500 to-blue-500";
  };

  const getSourceLabel = (source: string, medium: string) => {
    if (source === "(direct)") return "Direct";
    if (medium === "organic") return "Organic Search";
    if (medium === "social") return "Social Media";
    if (medium === "email") return "Email";
    if (medium === "cpc" || medium === "paid") return "Paid Search";
    if (medium === "referral") return "Referral";
    return source;
  };

  // Group by medium for summary
  const mediumStats: Record<string, any> = {};
  sources.forEach((source) => {
    const medium = source.medium || "(none)";
    if (!mediumStats[medium]) {
      mediumStats[medium] = {
        sessions: 0,
        users: 0,
        pageViews: 0,
        count: 0,
      };
    }
    mediumStats[medium].sessions += source.sessions;
    mediumStats[medium].users += source.users;
    mediumStats[medium].pageViews += source.pageViews;
    mediumStats[medium].count += 1;
  });

  const mediumBreakdown = Object.entries(mediumStats)
    .map(([medium, stats]) => ({
      medium: medium === "(none)" ? "Other" : medium,
      sessions: stats.sessions,
      users: stats.users,
      pageViews: stats.pageViews,
      percentage: (stats.sessions / totalSessions) * 100,
    }))
    .sort((a, b) => b.sessions - a.sessions);

  return (
    <div className="space-y-6">
      {/* Medium Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mediumBreakdown.slice(0, 4).map((medium, index) => {
          const Icon = getSourceIcon("", medium.medium);
          const gradient = getSourceColor("", medium.medium);
          
          return (
            <Card 
              key={index}
              className="border border-gray-200 shadow-md hover:shadow-lg transition-all"
            >
              <CardBody className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 bg-gradient-to-br ${gradient} rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <Chip 
                    size="sm" 
                    variant="flat"
                    className="bg-gray-100 text-gray-700"
                  >
                    {medium.percentage.toFixed(1)}%
                  </Chip>
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1 capitalize">
                  {medium.medium}
                </p>
                <p className="text-2xl font-bold text-gray-800 mb-1">
                  {medium.sessions.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {medium.users.toLocaleString()} users
                </p>
                <Progress 
                  value={medium.percentage} 
                  color="primary"
                  className="mt-3"
                  size="sm"
                />
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Detailed Sources Table */}
      <Card className="border border-gray-200 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Traffic Sources</h3>
                <p className="text-sm text-gray-500">Detailed breakdown by source and medium</p>
              </div>
            </div>
            <Chip variant="flat" color="secondary" className="bg-indigo-100 text-indigo-700">
              {sources.length} Sources
            </Chip>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {sources.length === 0 ? (
            <div className="p-12 text-center">
              <ChartBarIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No traffic source data available</p>
              <p className="text-gray-400 text-sm mt-2">Traffic sources will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table 
                aria-label="Traffic sources table"
                removeWrapper
                classNames={{
                  th: "bg-gray-50 text-gray-700 font-bold text-xs uppercase",
                  td: "py-4",
                }}
              >
                <TableHeader>
                  <TableColumn>SOURCE</TableColumn>
                  <TableColumn>MEDIUM</TableColumn>
                  <TableColumn align="center">SESSIONS</TableColumn>
                  <TableColumn align="center">USERS</TableColumn>
                  <TableColumn align="center">PAGE VIEWS</TableColumn>
                  <TableColumn align="center">SHARE</TableColumn>
                </TableHeader>
                <TableBody>
                  {sources.map((source: any, index: number) => {
                    const percentage = (source.sessions / totalSessions) * 100;
                    const barPercentage = (source.sessions / maxSessions) * 100;
                    const Icon = getSourceIcon(source.source, source.medium);
                    const gradient = getSourceColor(source.source, source.medium);
                    const label = getSourceLabel(source.source, source.medium);
                    
                    return (
                      <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 bg-gradient-to-br ${gradient} rounded-lg`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {label}
                              </p>
                              {source.source !== "(direct)" && (
                                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                  {source.source}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            size="sm" 
                            variant="flat"
                            className="capitalize"
                            color={
                              source.medium === "organic" ? "success" :
                              source.medium === "social" ? "secondary" :
                              source.medium === "email" ? "primary" :
                              source.medium === "cpc" || source.medium === "paid" ? "warning" :
                              "default"
                            }
                          >
                            {source.medium || "none"}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-bold text-gray-800 text-lg">
                              {source.sessions.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {percentage.toFixed(1)}% of total
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-semibold text-gray-700">
                              {source.users.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {source.sessions > 0 
                                ? (source.sessions / source.users).toFixed(1) 
                                : '0'} sessions/user
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-semibold text-gray-700">
                              {source.pageViews.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {source.sessions > 0 
                                ? (source.pageViews / source.sessions).toFixed(1) 
                                : '0'} views/session
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={barPercentage} 
                              color="secondary"
                              className="max-w-[100px]"
                              size="sm"
                            />
                            <span className="text-xs text-gray-500 w-12 text-right">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Summary Footer */}
      {sources.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-gray-200 shadow-md">
            <CardBody className="p-5">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalSessions.toLocaleString()}
                </p>
              </div>
            </CardBody>
          </Card>
          <Card className="border border-gray-200 shadow-md">
            <CardBody className="p-5">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">
                  {sources.reduce((sum, s) => sum + s.users, 0).toLocaleString()}
                </p>
              </div>
            </CardBody>
          </Card>
          <Card className="border border-gray-200 shadow-md">
            <CardBody className="p-5">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Total Page Views</p>
                <p className="text-2xl font-bold text-gray-800">
                  {sources.reduce((sum, s) => sum + s.pageViews, 0).toLocaleString()}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
