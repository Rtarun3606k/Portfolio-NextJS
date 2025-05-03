/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
