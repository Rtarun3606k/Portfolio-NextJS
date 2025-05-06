"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { commands } from "@uiw/react-md-editor";
import { FaImage } from "react-icons/fa";
import { auth } from "@/app/auth";
import Image from "next/image";
import Link from "next/link";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

export default function MarkdownEditor() {
  const [value, setValue] = useState("**Hello Markdown!**");
  const [blogDetails, setBlogDetails] = useState({
    title: "",
    author: "",
  });
  const [blogImage, setBlogImage] = useState(null);
  const [blogImageUrl, setBlogImageUrl] = useState("");
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle image upload to Azure Blob Storage
  const uploadImageToAzure = async (file) => {
    if (!file) return null;

    setIsUploading(true);
    try {
      // Create a new FormData instance
      const formData = new FormData();
      formData.append("file", file);

      // Get current timestamp for unique blob naming
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split(".").pop();
      const fileName = `blog-${timestamp}.${fileExtension}`;
      formData.append("fileName", fileName);

      // Include content type to ensure proper MIME type is set
      const contentType = file.type;
      formData.append("contentType", contentType);

      // Make API call to upload to Azure Blob Storage
      const response = await fetch("/api/blogs/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      setBlogImageUrl(data.url);
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(`Image upload failed: ${error.message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle blog image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBlogImage(file);
    // Create temporary preview URL
    const tempUrl = URL.createObjectURL(file);
    setBlogImageUrl(tempUrl);

    // Upload to Azure Blob Storage
    await uploadImageToAzure(file);
  };

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

      // Upload to Azure Blob Storage
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        // Include metadata for Azure Blob Storage best practices
        const timestamp = new Date().getTime();
        const fileExtension = file.name.split(".").pop();
        const fileName = `content-${timestamp}.${fileExtension}`;
        formData.append("fileName", fileName);
        formData.append("contentType", file.type);

        const res = await fetch("/api/blogs/image", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Image upload failed");
        }

        const data = await res.json();
        if (data?.url) {
          const finalMarkdown = `![Image](${data.url})\n`;
          api.replaceSelection(finalMarkdown);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        api.replaceSelection(`![Upload failed]()\n`);
      } finally {
        setIsUploading(false);
      }
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

  const onSave = async () => {
    try {
      // Validate required fields
      if (
        !blogDetails.title ||
        !blogDetails.author ||
        !value ||
        !blogImageUrl
      ) {
        alert("Title and Author are required fields");
        return;
      }

      // Get session info if authentication is required
      //   const session = await auth();

      const body = {
        title: blogDetails.title,
        author: blogDetails.author,
        content: value,
        featuredImage: blogImageUrl,
        // userId: session?.user?.id,
      };

      console.log("Creating blog post:", body);
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create blog post");
      }

      const data = await res.json();
      console.log("Blog post created successfully:", data);
      alert("Blog post created successfully");

      // Optional: Clear form after successful submission
      setBlogDetails({
        title: "",
        author: "",
      });
      setValue("");
      setBlogImage(null);
      setBlogImageUrl("");
    } catch (error) {
      console.error("Error creating blog post:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Clean up object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (blogImageUrl && blogImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(blogImageUrl);
      }
    };
  }, [blogImageUrl]);

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-[#e0f7fa] to-[#fce4ec] min-h-screen">
      <h1 className="text-center font-playfair text-black text-3xl m-3">
        Blog Editor
      </h1>
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={blogDetails.title}
          onChange={(e) =>
            setBlogDetails({ ...blogDetails, title: e.target.value })
          }
          className="w-full p-2 border border-[#C71585] rounded text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#5E60CE]"
        />
        <input
          type="text"
          placeholder="Authors"
          value={blogDetails.author}
          onChange={(e) =>
            setBlogDetails({ ...blogDetails, author: e.target.value })
          }
          className="w-full p-2 border border-[#C71585] rounded text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#5E60CE]"
        />
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept="image/*"
            id="blogImage"
            onChange={handleImageChange}
            className="w-full p-2 border border-[#C71585] rounded text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#5E60CE]"
          />
          {isUploading && (
            <span className="text-sm text-[#5E60CE]">Uploading...</span>
          )}
        </div>
      </div>

      <MDEditor
        value={value}
        onChange={setValue}
        commands={[...commands.getCommands(), imageCommand]}
        className="border border-[#C71585] rounded"
        textareaProps={{
          placeholder: "Write your markdown content here...",
        }}
        previewOptions={{
          className: "bg-white text-black",
        }}
        visibleDragbar={false}
        data-color-mode="light"
      />

      <div className="mt-4 p-4 bg-[#FDFDFD] shadow rounded border border-[#C71585]">
        <h3 className="text-[#5E60CE] mb-2 font-semibold">Content Preview</h3>
        <MarkdownPreview
          source={value}
          wrapperElement={{ "data-color-mode": "light" }}
          style={{ backgroundColor: "white", color: "black" }}
        />
      </div>

      <div className="mt-4 p-4 bg-[#FDFDFD] shadow rounded border border-[#C71585]">
        <h3 className="text-[#5E60CE] mb-2 font-semibold">Blog Preview</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div
            className="md:w-[30%] relative overflow-hidden rounded-md border border-gray-200"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            {blogImageUrl ? (
              <div className="relative h-48 w-full">
                <img
                  src={blogImageUrl}
                  alt={blogDetails.title || "Blog featured image"}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isImageHovered ? "scale-130" : "scale-100"
                  }`}
                  style={{
                    objectFit: "cover",
                    transform: isImageHovered ? "scale(1.3)" : "scale(1)",
                  }}
                />
              </div>
            ) : (
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image selected</span>
              </div>
            )}
          </div>
          <div className="md:w-[70%]">
            <h2 className="text-2xl font-bold text-[#1C1C1C] mb-2">
              {blogDetails.title || "Your Blog Title"}
            </h2>
            <p className="text-[#5E60CE] mb-4">
              By {blogDetails.author || "Author Name"}
            </p>
            <div className="line-clamp-3 text-[#1C1C1C]">
              <MarkdownPreview
                source={value}
                wrapperElement={{ "data-color-mode": "light" }}
                style={{ backgroundColor: "white", color: "black" }}
                maximumLines={3}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex  justify-between ">
        <Link href="/dashboard/blogs">
          <button
            className="px-4 py-2 bg-[#5E60CE] hover:bg-[#7209B7] text-white rounded transition-colors duration-300"
            //   onClick={onSave}
            disabled={isUploading}
          >
            {"<- Back"}
          </button>
        </Link>
        <button
          className="px-4 py-2 bg-[#5E60CE] hover:bg-[#7209B7] text-white rounded transition-colors duration-300"
          onClick={onSave}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Save Blog"}
        </button>
      </div>
    </div>
  );
}
