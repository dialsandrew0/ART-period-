/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Add your image host(s) here once storage is chosen, e.g.
    // Supabase Storage, Cloudinary, or S3/CloudFront.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
