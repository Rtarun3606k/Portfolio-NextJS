// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard/", // Protect admin dashboard
        "/api/", // Protect API endpoints
        "/_next/", // Protect Next.js system files
      ],
    },
    sitemap: `${
      process.env.NEXT_PUBLIC_BASE_URL || "https://tarunnayaka.me"
    }/sitemap.xml`,
  };
}
