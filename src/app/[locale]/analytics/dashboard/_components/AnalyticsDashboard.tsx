"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Tabs,
  Tab,
} from "@nextui-org/react";
import {
  ChartBarIcon,
  UsersIcon,
  EyeIcon,
  ClockIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import TrafficOverview from "./TrafficOverview";
import TopPages from "./TopPages";
import UserBehavior from "./UserBehavior";
import TrafficSources from "./TrafficSources";
import RealtimeStats from "./RealtimeStats";

interface AnalyticsData {
  overview?: any;
  topPages?: any;
  behavior?: any;
  sources?: any;
  realtime?: any;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: "30daysAgo", end: "today" });

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [overviewRes, topPagesRes, behaviorRes, sourcesRes, realtimeRes] =
        await Promise.all([
          fetch(
            `/api/analytics/data?type=overview&startDate=${dateRange.start}&endDate=${dateRange.end}`
          ),
          fetch(
            `/api/analytics/data?type=topPages&startDate=${dateRange.start}&endDate=${dateRange.end}&limit=10`
          ),
          fetch(
            `/api/analytics/data?type=behavior&startDate=${dateRange.start}&endDate=${dateRange.end}`
          ),
          fetch(
            `/api/analytics/data?type=sources&startDate=${dateRange.start}&endDate=${dateRange.end}`
          ),
          fetch(`/api/analytics/data?type=realtime`),
        ]);

      const [overview, topPages, behavior, sources, realtime] =
        await Promise.all([
          overviewRes.json(),
          topPagesRes.json(),
          behaviorRes.json(),
          sourcesRes.json(),
          realtimeRes.json(),
        ]);

      if (overview.error) throw new Error(overview.error);
      if (topPages.error) throw new Error(topPages.error);
      if (behavior.error) throw new Error(behavior.error);
      if (sources.error) throw new Error(sources.error);
      if (realtime.error) throw new Error(realtime.error);

      setData({
        overview: overview.data,
        topPages: topPages.data,
        behavior: behavior.data,
        sources: sources.data,
        realtime: realtime.data,
      });
    } catch (err: any) {
      console.error("Error fetching analytics:", err);
      setError(err.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAllData();
  };

  const handleDateRangeChange = (range: string) => {
    const ranges: Record<string, { start: string; end: string }> = {
      today: { start: "today", end: "today" },
      "7days": { start: "7daysAgo", end: "today" },
      "30days": { start: "30daysAgo", end: "today" },
      "90days": { start: "90daysAgo", end: "today" },
    };
    setDateRange(ranges[range] || ranges["30days"]);
  };

  if (loading && !data.overview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardBody className="p-6">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={handleRefresh} color="primary">
                  Retry
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Track your website performance and user behavior
            </p>
          </div>
          <div className="flex gap-2">
            <select
              onChange={(e) => handleDateRangeChange(e.target.value)}
              value={
                Object.entries({
                  today: { start: "today", end: "today" },
                  "7days": { start: "7daysAgo", end: "today" },
                  "30days": { start: "30daysAgo", end: "today" },
                  "90days": { start: "90daysAgo", end: "today" },
                }).find(
                  ([_, range]) =>
                    range.start === dateRange.start && range.end === dateRange.end
                )?.[0] || "30days"
              }
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
            <Button
              isIconOnly
              variant="light"
              onClick={handleRefresh}
              aria-label="Refresh"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Realtime Stats */}
        {data.realtime && <RealtimeStats data={data.realtime} />}

        {/* Main Content Tabs */}
        <Tabs
          aria-label="Analytics tabs"
          className="mb-6"
          defaultSelectedKey="overview"
        >
          <Tab key="overview" title="Overview">
            {data.overview && (
              <TrafficOverview data={data.overview} dateRange={dateRange} />
            )}
          </Tab>
          <Tab key="pages" title="Top Pages">
            {data.topPages && <TopPages data={data.topPages} />}
          </Tab>
          <Tab key="behavior" title="User Behavior">
            {data.behavior && <UserBehavior data={data.behavior} />}
          </Tab>
          <Tab key="sources" title="Traffic Sources">
            {data.sources && <TrafficSources data={data.sources} />}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

