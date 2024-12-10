/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  images: {
    domains: ["sejwzcphuueybcsdraw.supabase.co"], // Ajoutez ici le domaine exact
  },
};

export default nextConfig;
