"use client";

// This layout is now a client component to prevent SSR errors
// All analytics data fetching happens client-side

export default function AnalyticsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

