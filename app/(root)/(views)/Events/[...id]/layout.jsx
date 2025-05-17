import { Metadata } from "next";

// Default static metadata for event pages
export const metadata = {
  title: "Tech Event | Tarun Nayaka R",
  description:
    "Learn more about tech events and conferences hosted by Tarun Nayaka R",
  openGraph: {
    type: "article",
    siteName: "Tarun Nayaka R",
    images: [
      {
        url: "/images/event-default.jpg", // Default OG image fallback
        width: 1200,
        height: 630,
        alt: "Tech event featured image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Event | Tarun Nayaka R",
    description:
      "Learn more about tech events and conferences hosted by Tarun Nayaka R",
    images: ["/images/event-default.jpg"],
    creator: "@tarunnayakar",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EventPostLayout({ children }) {
  return <>{children}</>;
}
