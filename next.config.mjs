/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  // images: {
  //   domains: ["sejwzcphuueybcsdraw.supabase.co"], // Ajoutez ici le domaine exact
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sejwzcphuueybcsdraw.supabase.co",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/6.x/identicon/svg",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
