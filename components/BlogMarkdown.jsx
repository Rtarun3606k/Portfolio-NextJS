"use client";
import React from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeRaw from "rehype-raw";

const BlogMarkdown = ({ content }) => {
  return (
    <div>
      {/* <div className="markdown-body">
        <MarkdownPreview
          source={content}
          wrapperElement={{ "data-color-mode": "light" }}
          style={{ backgroundColor: "#c7d2fe", color: "black" }}
        />
      </div> */}

      <div
        className="markdown-body prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{
          __html: content
            // Basic Markdown conversion (headings, paragraphs, lists)
            .replace(/^# (.*$)/gm, "<h1>$1</h1>")
            .replace(/^## (.*$)/gm, "<h2>$1</h2>")
            .replace(/^### (.*$)/gm, "<h3>$1</h3>")
            .replace(/\*\*(.*)\*\*/gm, "<strong>$1</strong>")
            .replace(/\*(.*)\*/gm, "<em>$1</em>")
            .replace(/\n/gm, "<br />"),
        }}
      />
    </div>
  );
};

export default BlogMarkdown;
