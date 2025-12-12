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
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  GlobeAltIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface UserBehaviorProps {
  data: any;
}

export default function UserBehavior({ data }: UserBehaviorProps) {
  // Handle both direct data and nested data structure
  const responseData = data?.data || data;
  const rows = responseData?.rows || [];

  // Group by device category
  const deviceData: Record<string, any> = {};
  const countryData: Record<string, any> = {};

  rows.forEach((row: any) => {
    const dimensions = row.dimensionValues || [];
    const metrics = row.metricValues || [];
    
    const device = dimensions[0]?.value || "Unknown";
    const country = dimensions[1]?.value || "Unknown";
    const city = dimensions[2]?.value || "Unknown";

    // Device aggregation
    if (!deviceData[device]) {
      deviceData[device] = {
        users: 0,
        sessions: 0,
        pageViews: 0,
        avgDuration: 0,
        count: 0,
      };
    }
    deviceData[device].users += parseFloat(metrics[0]?.value || "0") || 0;
    deviceData[device].sessions += parseFloat(metrics[1]?.value || "0") || 0;
    deviceData[device].pageViews += parseFloat(metrics[2]?.value || "0") || 0;
    deviceData[device].avgDuration += parseFloat(metrics[3]?.value || "0") || 0;
    deviceData[device].count += 1;

    // Country aggregation
    if (!countryData[country]) {
      countryData[country] = {
        users: 0,
        sessions: 0,
        pageViews: 0,
        avgDuration: 0,
        count: 0,
      };
    }
    countryData[country].users += parseFloat(metrics[0]?.value || "0") || 0;
    countryData[country].sessions += parseFloat(metrics[1]?.value || "0") || 0;
    countryData[country].pageViews += parseFloat(metrics[2]?.value || "0") || 0;
    countryData[country].avgDuration += parseFloat(metrics[3]?.value || "0") || 0;
    countryData[country].count += 1;
  });

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const deviceStats = Object.entries(deviceData).map(([device, stats]) => ({
    device,
    users: stats.users,
    sessions: stats.sessions,
    pageViews: stats.pageViews,
    avgDuration: stats.avgDuration / stats.count,
  }));

  const countryStats = Object.entries(countryData)
    .map(([country, stats]) => ({
      country,
      users: stats.users,
      sessions: stats.sessions,
      pageViews: stats.pageViews,
      avgDuration: stats.avgDuration / stats.count,
    }))
    .sort((a, b) => b.users - a.users)
    .slice(0, 10);

  const totalUsers = deviceStats.reduce((sum, d) => sum + d.users, 0);
  const maxDeviceUsers = Math.max(...deviceStats.map(d => d.users), 1);
  const maxCountryUsers = Math.max(...countryStats.map(c => c.users), 1);

  const getDeviceIcon = (device: string) => {
    const deviceLower = device.toLowerCase();
    if (deviceLower.includes("mobile") || deviceLower.includes("phone")) {
      return DevicePhoneMobileIcon;
    } else if (deviceLower.includes("tablet")) {
      return DeviceTabletIcon;
    }
    return ComputerDesktopIcon;
  };

  const getDeviceColor = (device: string) => {
    const deviceLower = device.toLowerCase();
    if (deviceLower.includes("mobile") || deviceLower.includes("phone")) {
      return "from-blue-500 to-cyan-500";
    } else if (deviceLower.includes("tablet")) {
      return "from-purple-500 to-pink-500";
    }
    return "from-indigo-500 to-blue-500";
  };

  return (
    <div className="space-y-6">
      {/* Device Statistics */}
      <Card className="border border-gray-200 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Traffic by Device</h3>
                <p className="text-sm text-gray-500">User distribution across devices</p>
              </div>
            </div>
            <Chip variant="flat" color="secondary" className="bg-indigo-100 text-indigo-700">
              {deviceStats.length} Devices
            </Chip>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {deviceStats.length === 0 ? (
            <div className="p-12 text-center">
              <ChartBarIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No device data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table 
                aria-label="Device statistics"
                removeWrapper
                classNames={{
                  th: "bg-gray-50 text-gray-700 font-bold text-xs uppercase",
                  td: "py-4",
                }}
              >
                <TableHeader>
                  <TableColumn>DEVICE</TableColumn>
                  <TableColumn align="center">USERS</TableColumn>
                  <TableColumn align="center">SESSIONS</TableColumn>
                  <TableColumn align="center">PAGE VIEWS</TableColumn>
                  <TableColumn align="center">AVG. DURATION</TableColumn>
                  <TableColumn align="center">SHARE</TableColumn>
                </TableHeader>
                <TableBody>
                  {deviceStats.map((stat, index) => {
                    const percentage = (stat.users / totalUsers) * 100;
                    const Icon = getDeviceIcon(stat.device);
                    const gradient = getDeviceColor(stat.device);
                    
                    return (
                      <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 bg-gradient-to-br ${gradient} rounded-lg`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 capitalize">
                                {stat.device}
                              </p>
                              <p className="text-xs text-gray-500">
                                {percentage.toFixed(1)}% of users
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-bold text-gray-800 text-lg">
                              {stat.users.toLocaleString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-semibold text-gray-700">
                              {stat.sessions.toLocaleString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-semibold text-gray-700">
                              {stat.pageViews.toLocaleString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-semibold text-gray-700">
                              {formatDuration(stat.avgDuration)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={percentage} 
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

      {/* Geographic Statistics */}
      <Card className="border border-gray-200 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                <GlobeAltIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Top Countries</h3>
                <p className="text-sm text-gray-500">Geographic distribution of users</p>
              </div>
            </div>
            <Chip variant="flat" color="success" className="bg-green-100 text-green-700">
              {countryStats.length} Countries
            </Chip>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {countryStats.length === 0 ? (
            <div className="p-12 text-center">
              <GlobeAltIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No geographic data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table 
                aria-label="Country statistics"
                removeWrapper
                classNames={{
                  th: "bg-gray-50 text-gray-700 font-bold text-xs uppercase",
                  td: "py-4",
                }}
              >
                <TableHeader>
                  <TableColumn width={50}>RANK</TableColumn>
                  <TableColumn>COUNTRY</TableColumn>
                  <TableColumn align="center">USERS</TableColumn>
                  <TableColumn align="center">SESSIONS</TableColumn>
                  <TableColumn align="center">PAGE VIEWS</TableColumn>
                  <TableColumn align="center">AVG. DURATION</TableColumn>
                  <TableColumn align="center">SHARE</TableColumn>
                </TableHeader>
                <TableBody>
                  {countryStats.map((stat, index) => {
                    const percentage = (stat.users / totalUsers) * 100;
                    const barPercentage = (stat.users / maxCountryUsers) * 100;
                    
                    return (
                      <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                              index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                              index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                            <p className="font-semibold text-gray-800">{stat.country}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-bold text-gray-800 text-lg">
                              {stat.users.toLocaleString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-semibold text-gray-700">
                              {stat.sessions.toLocaleString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-semibold text-gray-700">
                              {stat.pageViews.toLocaleString()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-semibold text-gray-700">
                              {formatDuration(stat.avgDuration)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={barPercentage} 
                              color="success"
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
    </div>
  );
}
