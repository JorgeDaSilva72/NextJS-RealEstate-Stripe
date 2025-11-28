"use client";

import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

interface UserBehaviorProps {
  data: any;
}

export default function UserBehavior({ data }: UserBehaviorProps) {
  const rows = data?.rows || [];

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
    deviceData[device].users += parseInt(metrics[0]?.value || "0");
    deviceData[device].sessions += parseInt(metrics[1]?.value || "0");
    deviceData[device].pageViews += parseInt(metrics[2]?.value || "0");
    deviceData[device].avgDuration += parseFloat(metrics[3]?.value || "0");
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
    countryData[country].users += parseInt(metrics[0]?.value || "0");
    countryData[country].sessions += parseInt(metrics[1]?.value || "0");
    countryData[country].pageViews += parseInt(metrics[2]?.value || "0");
    countryData[country].avgDuration += parseFloat(metrics[3]?.value || "0");
    countryData[country].count += 1;
  });

  const formatDuration = (seconds: number) => {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Traffic by Device</h3>
        </CardHeader>
        <CardBody>
          {deviceStats.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No data available</p>
          ) : (
            <Table aria-label="Device statistics">
              <TableHeader>
                <TableColumn>DEVICE</TableColumn>
                <TableColumn>USERS</TableColumn>
                <TableColumn>SESSIONS</TableColumn>
                <TableColumn>PAGE VIEWS</TableColumn>
                <TableColumn>AVG. DURATION</TableColumn>
              </TableHeader>
              <TableBody>
                {deviceStats.map((stat, index) => (
                  <TableRow key={index}>
                    <TableCell className="capitalize">{stat.device}</TableCell>
                    <TableCell>{stat.users.toLocaleString()}</TableCell>
                    <TableCell>{stat.sessions.toLocaleString()}</TableCell>
                    <TableCell>{stat.pageViews.toLocaleString()}</TableCell>
                    <TableCell>{formatDuration(stat.avgDuration)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Top Countries</h3>
        </CardHeader>
        <CardBody>
          {countryStats.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No data available</p>
          ) : (
            <Table aria-label="Country statistics">
              <TableHeader>
                <TableColumn>COUNTRY</TableColumn>
                <TableColumn>USERS</TableColumn>
                <TableColumn>SESSIONS</TableColumn>
                <TableColumn>PAGE VIEWS</TableColumn>
                <TableColumn>AVG. DURATION</TableColumn>
              </TableHeader>
              <TableBody>
                {countryStats.map((stat, index) => (
                  <TableRow key={index}>
                    <TableCell>{stat.country}</TableCell>
                    <TableCell>{stat.users.toLocaleString()}</TableCell>
                    <TableCell>{stat.sessions.toLocaleString()}</TableCell>
                    <TableCell>{stat.pageViews.toLocaleString()}</TableCell>
                    <TableCell>{formatDuration(stat.avgDuration)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

