"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { commands } from "@uiw/react-md-editor";
import { FaImage } from "react-icons/fa";

// Dynamically import the Markdown editor with SSR disabled
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

export default function EventDescription({ value, onChange, placeholder }) {
  const [isUploading, setIsUploading] = useState(false);

  // Custom image upload command for markdown editor
  const imageCommand = {
    name: "image-upload",
    keyCommand: "image-upload",
    buttonProps: { "aria-label": "Upload image" },
    icon: <FaImage />,
    execute: async (state, api) => {
      const file = await selectImage();
      if (!file) return;

      // Show temporary local blob preview
      const tempUrl = URL.createObjectURL(file);
      const tempMarkdown = `![Uploading...](${tempUrl})\n`;
      api.replaceSelection(tempMarkdown);

      // Upload to Azure Blob Storage with retry mechanism
      setIsUploading(true);
      let retries = 0;
      const maxRetries = 3;

      while (retries < maxRetries) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          // Include metadata for Azure Blob Storage
          const timestamp = new Date().getTime();
          const fileExtension = file.name.split(".").pop().toLowerCase();
          const fileName = `events/${new Date().getFullYear()}/${
            new Date().getMonth() + 1
          }/${timestamp}-${file.name.replace(/\s+/g, "-")}`;
          formData.append("fileName", fileName);
          formData.append("contentType", file.type);
          formData.append("container", "events");

          // Add additional metadata as a JSON string
          const metadata = {
            uploadedAt: new Date().toISOString(),
            context: "event-content-image",
            position: state.selection ? String(state.selection.start) : "0",
            fileSize: String(file.size),
          };

          formData.append("metadata", JSON.stringify(metadata));

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!res.ok) {
            if (res.status >= 500 && retries < maxRetries - 1) {
              // Retry server errors
              retries++;
              // Exponential backoff
              await new Promise((r) =>
                setTimeout(r, 1000 * Math.pow(2, retries))
              );
              continue;
            }
            throw new Error(`Image upload failed: ${res.status}`);
          }

          const data = await res.json();
          if (data?.url) {
            const finalMarkdown = `![Image](${data.url})\n`;
            api.replaceSelection(finalMarkdown);
          }
          break; // Success, exit retry loop
        } catch (error) {
          console.error(
            `Error uploading image (attempt ${retries + 1}):`,
            error
          );
          if (retries >= maxRetries - 1) {
            api.replaceSelection(`![Upload failed]()\n`);
            alert(
              `Image upload failed after ${maxRetries} attempts: ${error.message}`
            );
          } else {
            retries++;
            // Exponential backoff
            await new Promise((r) =>
              setTimeout(r, 1000 * Math.pow(2, retries))
            );
          }
        }
      }

      setIsUploading(false);
    },
  };

  const selectImage = () =>
    new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => resolve(input.files[0]);
      input.click();
    });

  return (
    <div className="w-full">
      <MDEditor
        value={value}
        onChange={onChange}
        commands={[...commands.getCommands(), imageCommand]}
        className="border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
        textareaProps={{
          placeholder:
            placeholder || "Write your event description using Markdown...",
        }}
        previewOptions={{
          className: "bg-white text-gray-700",
        }}
        visibleDragbar={false}
        data-color-mode="light"
        height={300}
      />
      {isUploading && (
        <div className="mt-1 text-sm text-blue-600">Uploading image...</div>
      )}
    </div>
  );
}
