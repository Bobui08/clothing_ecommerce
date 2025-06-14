import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
