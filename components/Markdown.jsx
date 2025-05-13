"use client";

import dynamic from "next/dynamic";
import React from "react";
import rehypePrismPlus from "rehype-prism-plus";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

export default function Markdown({ source }) {
  return (
    <MarkdownPreview
      source={source}
      wrapperElement={{ "data-color-mode": "light" }}
      style={{ backgroundColor: "white", color: "black" }}
    />
  );
}
