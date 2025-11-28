"use client";

import { useEffect, useState, Suspense } from "react";
import { Card, CardBody, CardHeader, Button, Spinner } from "@nextui-org/react";
import { ChartBarIcon, UsersIcon, EyeIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import AnalyticsDashboard from "./_components/AnalyticsDashboard";

function AnalyticsDashboardContent() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    checkConnection();
    
    // Check for success/error messages from OAuth callback
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    
    if (success === "true") {
      // Refresh connection status after successful OAuth
      setTimeout(() => {
        checkConnection();
      }, 1000);
    }
    
    if (error) {
      console.error("OAuth error:", error);
    }
  }, [searchParams]);

  const checkConnection = async () => {
    try {
      const response = await fetch("/api/analytics/status");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // If user is not authenticated, redirect to login
      if (data.authenticated === false) {
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `/api/auth/login?post_login_redirect_url=${returnUrl}`;
        return;
      }
      
      setConnected(data.connected ?? false);
    } catch (error) {
      console.error("Error checking connection:", error);
      // Don't redirect on error, just show the connect screen
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    window.location.href = "/api/analytics/auth";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-gray-800">
                Google Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Connect your Google Analytics account to view traffic and user behavior data
              </p>
            </CardHeader>
            <CardBody className="flex flex-col items-center justify-center py-12 gap-6">
              <div className="text-center">
                <ChartBarIcon className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-6">
                  You need to connect your Google Analytics account to view analytics data.
                </p>
                <Button
                  color="primary"
                  size="lg"
                  onClick={handleConnect}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Connect Google Analytics
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return <AnalyticsDashboard />;
}

export default function AnalyticsDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <AnalyticsDashboardContent />
    </Suspense>
  );
}

