"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Tabs,
  Tab,
  Chip,
} from "@nextui-org/react";
import {
  ChartBarIcon,
  UsersIcon,
  EyeIcon,
  ClockIcon,
  ArrowPathIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
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
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    console.log("[AnalyticsDashboard] fetchAllData called");

    try {
      console.log("[AnalyticsDashboard] Starting API calls...");
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
      setLastRefresh(new Date());
    } catch (err: any) {
      console.error("[AnalyticsDashboard] Error fetching analytics:", err);
      console.error("[AnalyticsDashboard] Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
        response: err.response,
      });
      
      // Note: File logging only works server-side
      // Client-side errors are logged to console only
      
      setError(err.message || "Failed to fetch analytics data");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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

  const formatDateRange = () => {
    const ranges: Record<string, string> = {
      today: "Today",
      "7days": "Last 7 Days",
      "30days": "Last 30 Days",
      "90days": "Last 90 Days",
    };
    const key = Object.entries({
      today: { start: "today", end: "today" },
      "7days": { start: "7daysAgo", end: "today" },
      "30days": { start: "30daysAgo", end: "today" },
      "90days": { start: "90daysAgo", end: "today" },
    }).find(
      ([_, range]) =>
        range.start === dateRange.start && range.end === dateRange.end
    )?.[0] || "30days";
    return ranges[key] || "Last 30 Days";
  };

  if (loading && !data.overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-2 border-red-200 shadow-lg">
            <CardBody className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChartBarIcon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h3>
                <p className="text-red-600 mb-6">{error}</p>
                <Button 
                  onClick={handleRefresh} 
                  color="primary"
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                >
                  <ArrowPathIcon className="w-5 h-5 mr-2" />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Professional Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Analytics Dashboard
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Comprehensive website performance insights
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
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
                  className="bg-transparent border-none outline-none text-gray-700 font-medium cursor-pointer"
                >
                  <option value="today">Today</option>
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                </select>
              </div>
              <Button
                isIconOnly
                variant="light"
                onClick={handleRefresh}
                aria-label="Refresh"
                className="bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"
                disabled={loading}
              >
                <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Chip 
                variant="flat" 
                color="success" 
                size="sm"
                className="text-xs"
              >
                {formatDateRange()}
              </Chip>
            </div>
          </div>
          {lastRefresh && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>

        {/* Realtime Stats - Enhanced */}
        {data.realtime && <RealtimeStats data={data.realtime} />}

        {/* Main Content Tabs - Professional Design */}
        <Card className="shadow-xl border border-gray-100">
          <Tabs
            aria-label="Analytics tabs"
            className="w-full"
            defaultSelectedKey="overview"
            classNames={{
              tabList: "gap-2 w-full relative rounded-none p-4 bg-gray-50 border-b border-gray-200",
              cursor: "w-full bg-gradient-to-r from-blue-600 to-indigo-600",
              tab: "max-w-fit px-6 h-12",
              tabContent: "group-data-[selected=true]:text-white font-semibold",
            }}
          >
            <Tab 
              key="overview" 
              title={
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5" />
                  <span>Overview</span>
                </div>
              }
            >
              <div className="p-6">
                {data.overview && (
                  <TrafficOverview data={data.overview} dateRange={dateRange} />
                )}
              </div>
            </Tab>
            <Tab 
              key="pages" 
              title={
                <div className="flex items-center gap-2">
                  <EyeIcon className="w-5 h-5" />
                  <span>Top Pages</span>
                </div>
              }
            >
              <div className="p-6">
                {data.topPages && <TopPages data={data.topPages} />}
              </div>
            </Tab>
            <Tab 
              key="behavior" 
              title={
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  <span>User Behavior</span>
                </div>
              }
            >
              <div className="p-6">
                {data.behavior && <UserBehavior data={data.behavior} />}
              </div>
            </Tab>
            <Tab 
              key="sources" 
              title={
                <div className="flex items-center gap-2">
                  <ArrowTrendingUpIcon className="w-5 h-5" />
                  <span>Traffic Sources</span>
                </div>
              }
            >
              <div className="p-6">
                {data.sources && <TrafficSources data={data.sources} />}
              </div>
            </Tab>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
