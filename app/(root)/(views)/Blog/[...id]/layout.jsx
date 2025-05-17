import { Metadata } from "next";

// Default static metadata for blog posts
export const metadata = {
  title: "Blog Post | Tarun Nayaka R",
  description: "Read the latest articles by Tarun Nayaka R",
  openGraph: {
    type: "article",
    siteName: "Tarun Nayaka R",
    images: [
      {
        url: "/image.png", // Default OG image fallback
        width: 1200,
        height: 630,
        alt: "Blog post featured image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Post | Tarun Nayaka R",
    description: "Read the latest articles by Tarun Nayaka R",
    images: ["/image.png"],
    creator: "@tarunnayakar",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPostLayout({ children }) {
  return <>{children}</>;
}
