// This file will be used as a fallback for generating OpenGraph images
// while keeping compatibility with the catch-all route

import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};

// Image generation
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundImage: "linear-gradient(to bottom, #6A0DAD, #4B0082)",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: 60,
              fontWeight: "bold",
              textAlign: "center",
              margin: 0,
            }}
          >
            Tarun Nayaka R
          </h1>
          <p style={{ fontSize: 30, margin: "20px 0 0", opacity: 0.8 }}>
            Fullstack Developer & Cloud Architect
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
