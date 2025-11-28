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
import { EyeIcon, UsersIcon, ClockIcon, LinkIcon } from "@heroicons/react/24/outline";

interface TopPagesProps {
  data: any;
}

export default function TopPages({ data }: TopPagesProps) {
  const rows = data?.rows || [];

  interface PageData {
    path: string;
    title: string;
    views: number;
    users: number;
    avgDuration: number;
  }

  const pages: PageData[] = rows.map((row: any) => {
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

  const totalViews = pages.reduce((sum: number, page: PageData) => sum + page.views, 0);
  const maxViews = Math.max(...pages.map(p => p.views), 1);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const formatPath = (path: string) => {
    if (path.length > 50) {
      return path.substring(0, 47) + "...";
    }
    return path;
  };

  return (
    <Card className="border border-gray-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <EyeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Top Performing Pages</h3>
              <p className="text-sm text-gray-500">Most viewed pages on your website</p>
            </div>
          </div>
          <Chip 
            variant="flat" 
            color="secondary"
            className="bg-purple-100 text-purple-700"
          >
            {pages.length} Pages
          </Chip>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {pages.length === 0 ? (
          <div className="p-12 text-center">
            <EyeIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No page data available</p>
            <p className="text-gray-400 text-sm mt-2">Start tracking to see your top pages here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table 
              aria-label="Top pages table"
              removeWrapper
              classNames={{
                th: "bg-gray-50 text-gray-700 font-bold text-xs uppercase",
                td: "py-4",
              }}
            >
              <TableHeader>
                <TableColumn width={50}>RANK</TableColumn>
                <TableColumn>PAGE</TableColumn>
                <TableColumn align="center">VIEWS</TableColumn>
                <TableColumn align="center">USERS</TableColumn>
                <TableColumn align="center">AVG. DURATION</TableColumn>
                <TableColumn align="center">PERFORMANCE</TableColumn>
              </TableHeader>
              <TableBody>
                {pages.map((page: any, index: number) => {
                  const percentage = (page.views / totalViews) * 100;
                  const barPercentage = (page.views / maxViews) * 100;
                  
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
                        <div className="max-w-md">
                          <div className="flex items-start gap-2">
                            <LinkIcon className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 truncate">
                                {page.title || "Untitled Page"}
                              </p>
                              <p className="text-sm text-gray-500 truncate" title={page.path}>
                                {formatPath(page.path)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-bold text-gray-800 text-lg">
                            {page.views.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {percentage.toFixed(1)}% of total
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <UsersIcon className="w-4 h-4 text-gray-400" />
                            <p className="font-semibold text-gray-700">
                              {page.users.toLocaleString()}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {page.views > 0 ? (page.views / page.users).toFixed(1) : '0'} views/user
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <ClockIcon className="w-4 h-4 text-gray-400" />
                            <p className="font-semibold text-gray-700">
                              {formatDuration(page.avgDuration)}
                            </p>
                          </div>
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
                            {barPercentage.toFixed(0)}%
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
        
        {/* Summary Footer */}
        {pages.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Views</p>
                <p className="text-lg font-bold text-gray-800">
                  {totalViews.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Users</p>
                <p className="text-lg font-bold text-gray-800">
                  {pages.reduce((sum: number, p: PageData) => sum + p.users, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Avg. Duration</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatDuration(
                    pages.reduce((sum: number, p: PageData) => sum + p.avgDuration, 0) / pages.length
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
