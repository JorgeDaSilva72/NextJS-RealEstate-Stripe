"use client";

import { Card, CardBody } from "@nextui-org/react";
import { UsersIcon } from "@heroicons/react/24/outline";

interface RealtimeStatsProps {
  data: any;
}

export default function RealtimeStats({ data }: RealtimeStatsProps) {
  // Parse realtime data
  const activeUsers =
    data?.rows?.[0]?.metricValues?.[0]?.value || "0";

  return (
    <Card className="mb-6">
      <CardBody className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <UsersIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Users Right Now</p>
            <p className="text-3xl font-bold text-gray-800">{activeUsers}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

