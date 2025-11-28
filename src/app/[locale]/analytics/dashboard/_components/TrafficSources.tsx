"use client";

import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

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

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Traffic Sources</h3>
      </CardHeader>
      <CardBody>
        {sources.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No data available</p>
        ) : (
          <Table aria-label="Traffic sources table">
            <TableHeader>
              <TableColumn>SOURCE</TableColumn>
              <TableColumn>MEDIUM</TableColumn>
              <TableColumn>SESSIONS</TableColumn>
              <TableColumn>USERS</TableColumn>
              <TableColumn>PAGE VIEWS</TableColumn>
            </TableHeader>
            <TableBody>
              {sources.map((source: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{source.source}</TableCell>
                  <TableCell>{source.medium}</TableCell>
                  <TableCell>{source.sessions.toLocaleString()}</TableCell>
                  <TableCell>{source.users.toLocaleString()}</TableCell>
                  <TableCell>{source.pageViews.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}

