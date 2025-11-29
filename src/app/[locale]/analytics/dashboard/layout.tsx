// Force dynamic rendering for analytics dashboard to prevent SSR errors
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AnalyticsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

