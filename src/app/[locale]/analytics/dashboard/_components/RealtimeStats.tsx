"use client";

import { Card, CardBody, Chip } from "@nextui-org/react";
import { UsersIcon, SignalIcon, ClockIcon } from "@heroicons/react/24/outline";

interface RealtimeStatsProps {
  data: any;
}

export default function RealtimeStats({ data }: RealtimeStatsProps) {
  // Parse realtime data
  const activeUsers =
    parseInt(data?.rows?.[0]?.metricValues?.[0]?.value || "0");

  // Get country breakdown if available
  const countryData = data?.rows?.slice(0, 5).map((row: any) => ({
    country: row.dimensionValues?.[0]?.value || "Unknown",
    users: parseInt(row.metricValues?.[0]?.value || "0"),
  })) || [];

  const totalCountries = countryData.length;

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
      <CardBody className="p-6 md:p-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
              <UsersIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <SignalIcon className="w-5 h-5 text-green-300 animate-pulse" />
                <Chip 
                  size="sm" 
                  variant="flat" 
                  className="bg-green-500/30 text-green-100 border-green-400/50"
                >
                  LIVE
                </Chip>
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">
                Active Users Right Now
              </p>
              <p className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
                {activeUsers.toLocaleString()}
              </p>
              <p className="text-blue-200 text-xs mt-2 flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                Real-time data updates every few seconds
              </p>
            </div>
          </div>

          {countryData.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 min-w-[200px]">
              <p className="text-blue-100 text-xs font-semibold mb-3 uppercase tracking-wide">
                Top Countries
              </p>
              <div className="space-y-2">
                {countryData.map((item: any, index: number) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-white font-medium truncate max-w-[120px]">
                      {item.country}
                    </span>
                    <span className="text-blue-200 font-bold ml-2">
                      {item.users}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
