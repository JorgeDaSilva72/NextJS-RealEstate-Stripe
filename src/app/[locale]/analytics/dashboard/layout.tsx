// Force dynamic rendering for analytics dashboard to prevent SSR errors
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Disable static generation completely
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

export default function AnalyticsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Log that layout is rendering
  console.log("[AnalyticsDashboardLayout] Rendering layout wrapper");
  
  try {
    return <>{children}</>;
  } catch (error: any) {
    console.error("[AnalyticsDashboardLayout] Error rendering children:", error);
    console.error("[AnalyticsDashboardLayout] Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Error Loading Dashboard
          </h1>
          <p className="text-gray-600 mb-4">
            {process.env.NODE_ENV === "development" 
              ? error.message 
              : "An error occurred while loading the dashboard."}
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }
}

