import { Geist, Geist_Mono } from "next/font/google";
import { spaceGrotesk, playfairDisplay, poppins, tagesschrift } from "./fonts";
import "./globals.css";
import "./markdown.css";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Enhanced metadata with professional description
export const metadata = {
  title:
    "Tarun Nayaka R - Fullstack Developer | Cloud Architect | DevOps Engineer",
  description:
    "Fullstack Developer and Cloud Architect with expertise in React, Next.js, Python, Azure, and Google Cloud. Delivering high-performance web applications, cloud solutions, and mobile experiences that drive business growth through innovative technology implementation.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://tarunnayaka.me"
  ),
  keywords:
    "Fullstack Developer, Cloud Architect, DevOps Engineer, Web Development, Mobile Applications, React, Next.js, TypeScript, JavaScript, Node.js, Python, Django, Flask, FastAPI, MongoDB, PostgreSQL, GraphQL, Azure, Google Cloud, Firebase, Docker, Kubernetes",
  openGraph: {
    title: "Tarun Nayaka R - Fullstack Developer | Cloud Architect",
    description:
      "Delivering high-performance web applications, cloud solutions, and mobile experiences with React, Next.js, TypeScript, Python, Azure, and more.",
    url: "https://tarunnayaka.me",
    siteName: "Tarun Nayaka R",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/image.png", // Your OG image
        width: 1200,
        height: 630,
        alt: "Tarun Nayaka R - Fullstack Developer and Cloud Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarun Nayaka R - Fullstack Developer | Cloud Architect",
    description:
      "3+ years of expertise in React, Next.js, TypeScript, Python, Azure, and Google Cloud. Building scalable digital solutions.",
    creator: "@TarunNayakaR",
    images: ["/image.png"], // Same as OG image for consistency
  },
  icons: {
    icon: "/image.png",
    shortcut: "/image.png",
    apple: "/image.png",
  },
  manifest: "/site.webmanifest",
};

// Create a client component for SessionProvider

// Make Providers a client component to avoid hydration issues

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* <link rel="icon" href="/image.png" />
        <link rel="apple-touch-icon" href="/image.png" />
        <link rel="shortcut icon" href="/image.png" /> */}

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        {/* <meta name="theme-color" content="#000000" /> */}
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable} ${poppins.variable} ${tagesschrift.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
