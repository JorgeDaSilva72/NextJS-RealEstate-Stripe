"use client";

// Force this page to be client-only and never pre-rendered
import dynamic from "next/dynamic";
import { useEffect, useState, Suspense } from "react";
import { Card, CardBody, CardHeader, Button, Spinner } from "@nextui-org/react";
import { ChartBarIcon, UsersIcon, EyeIcon, ClockIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";

// Dynamically import AnalyticsDashboard to ensure it's client-only
const AnalyticsDashboard = dynamic(
  () => import("./_components/AnalyticsDashboard"),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }
);

function AnalyticsDashboardContent() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();

  // Ensure this only runs on client
  useEffect(() => {
    setMounted(true);
    console.log("[AnalyticsDashboard] Component mounted on client");
  }, []);

  useEffect(() => {
    if (!mounted) return; // Don't run on server
    
    console.log("[AnalyticsDashboard] Checking connection...");
    checkConnection();
    
    // Check for success/error messages from OAuth callback
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    
    if (success === "true") {
      // Refresh connection status after successful OAuth
      setErrorMessage(null);
      setTimeout(() => {
        checkConnection();
      }, 1000);
    }
    
    if (error) {
      const decodedError = decodeURIComponent(error);
      console.error("OAuth error:", decodedError);
      setErrorMessage(decodedError);
      setLoading(false);
    }
  }, [searchParams, mounted]);

  const checkConnection = async () => {
    try {
      const response = await fetch("/api/analytics/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Don't throw on error status codes
        cache: "no-store",
      });
      
      // Always try to parse JSON, even if status is not ok
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        setConnected(false);
        setLoading(false);
        return;
      }
      
      // Handle different response scenarios
      if (!response.ok) {
        // If API returned error but with JSON, use that
        if (data.error || data.message) {
          console.error("API error:", data.error || data.message);
        }
        setConnected(false);
        setLoading(false);
        return;
      }
      
      // If user is not authenticated, redirect to login
      if (data.authenticated === false) {
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `/api/auth/login?post_login_redirect_url=${returnUrl}`;
        return;
      }
      
      // Set connection status
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

  // Don't render anything on server
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

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
              {errorMessage && (
                <div className="w-full mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-red-800 mb-1">
                        Connection Error
                      </h3>
                      <p className="text-sm text-red-700 break-words">
                        {errorMessage}
                      </p>
                    </div>
                    <button
                      onClick={() => setErrorMessage(null)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Dismiss error"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
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

