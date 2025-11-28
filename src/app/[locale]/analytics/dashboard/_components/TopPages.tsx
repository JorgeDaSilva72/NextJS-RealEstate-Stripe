"use client";

import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { EyeIcon } from "@heroicons/react/24/outline";

interface TopPagesProps {
  data: any;
}

export default function TopPages({ data }: TopPagesProps) {
  const rows = data?.rows || [];

  const pages = rows.map((row: any) => {
    const dimensions = row.dimensionValues || [];
    const metrics = row.metricValues || [];
    return {
      path: dimensions[0]?.value || "N/A",
      title: dimensions[1]?.value || "N/A",
      views: parseInt(metrics[0]?.value || "0"),
      users: parseInt(metrics[1]?.value || "0"),
      avgDuration: parseFloat(metrics[2]?.value || "0"),
    };
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Top Pages</h3>
      </CardHeader>
      <CardBody>
        {pages.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No data available</p>
        ) : (
          <Table aria-label="Top pages table">
            <TableHeader>
              <TableColumn>PAGE</TableColumn>
              <TableColumn>VIEWS</TableColumn>
              <TableColumn>USERS</TableColumn>
              <TableColumn>AVG. DURATION</TableColumn>
            </TableHeader>
            <TableBody>
              {pages.map((page: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{page.title}</p>
                      <p className="text-sm text-gray-500">{page.path}</p>
                    </div>
                  </TableCell>
                  <TableCell>{page.views.toLocaleString()}</TableCell>
                  <TableCell>{page.users.toLocaleString()}</TableCell>
                  <TableCell>{formatDuration(page.avgDuration)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}

