"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { commands } from "@uiw/react-md-editor";
import { FaImage, FaPlus, FaTimes } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

export default function MarkdownEditor({ id }) {
  const router = useRouter();
  const [value, setValue] = useState("**Hello Markdown!**");
  const [blogDetails, setBlogDetails] = useState({
    title: "",
    author: "",
    categories: [],
  });
  const [newCategory, setNewCategory] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [blogImageUrl, setBlogImageUrl] = useState("");
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch blog data if ID is provided (edit mode)
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id || id === "new") return;

      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch blog: ${res.status}`);
        }
        const data = await res.json();

        // Populate form with existing blog data
        setValue(data.content || "");
        setBlogDetails({
          title: data.title || "",
          author: data.author || "",
          categories: data.categories || [],
        });
        setBlogImageUrl(data.featuredImage || "");
        setIsEditing(true);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Handle category management
  const addCategory = () => {
    if (!newCategory.trim()) return;

    // Prevent duplicates
    if (blogDetails.categories.includes(newCategory.trim())) {
      alert("This category already exists");
      return;
    }

    setBlogDetails({
      ...blogDetails,
      categories: [...blogDetails.categories, newCategory.trim()],
    });
    setNewCategory("");
  };

  const removeCategory = (indexToRemove) => {
    setBlogDetails({
      ...blogDetails,
      categories: blogDetails.categories.filter(
        (_, index) => index !== indexToRemove
      ),
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCategory();
    }
  };

  // Handle image upload to Azure Blob Storage with best practices
  const uploadImageToAzure = async (file) => {
    if (!file) return null;

    setIsUploading(true);
    try {
      // Create a new FormData instance
      const formData = new FormData();
      formData.append("file", file);

      // Azure best practice: Use content-addressable storage pattern
      // Generate a unique hash-based filename using timestamp and original name
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split(".").pop().toLowerCase();

      // Azure best practice: Organize blobs in logical hierarchy
      const fileName = `${new Date().getFullYear()}/${
        new Date().getMonth() + 1
      }/${timestamp}-${file.name.replace(/\s+/g, "-")}`;
      formData.append("fileName", fileName);

      // Azure best practice: Set proper content type for CDN optimization
      const contentType = file.type;
      formData.append("contentType", contentType);

      // Azure best practice: Add metadata for better management
      formData.append(
        "metadata",
        JSON.stringify({
          uploadedAt: new Date().toISOString(),
          originalName: file.name,
          fileSize: file.size,
        })
      );

      // Make API call to upload to Azure Blob Storage
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/image`,
        {
          method: "POST",
          body: formData,
        }
      );

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

      // Upload to Azure Blob Storage with retry mechanism (best practice)
      setIsUploading(true);
      let retries = 0;
      const maxRetries = 3;

      while (retries < maxRetries) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          // Include metadata for Azure Blob Storage best practices
          const timestamp = new Date().getTime();
          const fileExtension = file.name.split(".").pop().toLowerCase();
          const fileName = `content/${new Date().getFullYear()}/${
            new Date().getMonth() + 1
          }/${timestamp}-${file.name.replace(/\s+/g, "-")}`;
          formData.append("fileName", fileName);
          formData.append("contentType", file.type);

          // Add additional metadata as a JSON string - Azure requires string values
          const metadata = {
            uploadedAt: new Date().toISOString(),
            context: "blog-content-image",
            position: state.selection ? String(state.selection.start) : "0",
            fileSize: String(file.size),
          };

          formData.append("metadata", JSON.stringify(metadata));

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/image`,
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

  const onSave = async () => {
    try {
      // Validate required fields
      if (!blogDetails.title || !blogDetails.author || !value) {
        alert("Title, author, and content are required fields");
        return;
      }

      const body = {
        title: blogDetails.title,
        author: blogDetails.author,
        content: value,
        featuredImage: blogImageUrl,
        categories: blogDetails.categories,
        updatedAt: new Date().toISOString(),
      };

      // Determine if we're creating or updating
      const endpoint = isEditing
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${id}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`;
      const method = isEditing ? "PATCH" : "POST";

      // console.log(`${isEditing ? "Updating" : "Creating"} blog post:`, body);
      const res = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error ||
            `Failed to ${isEditing ? "update" : "create"} blog post`
        );
      }

      const data = await res.json();
      // console.log(
      //   `Blog post ${isEditing ? "updated" : "created"} successfully:`,
      //   data
      // );
      alert(`Blog post ${isEditing ? "updated" : "created"} successfully`);

      // Navigate back to blogs dashboard
      router.push("/dashboard/blogs");
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} blog post:`,
        error.message
      );
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

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5E60CE]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 p-4 rounded-lg text-red-700">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
          <Link href="/dashboard/blogs">
            <button className="mt-4 px-4 py-2 bg-[#5E60CE] hover:bg-[#7209B7] text-white rounded transition-colors duration-300">
              Back to Blogs
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-[#e0f7fa] to-[#fce4ec] min-h-screen">
      <h1 className="text-center font-playfair text-black text-3xl m-3">
        {isEditing ? "Edit Blog" : "Create New Blog"}
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

        {/* Categories input and display section */}
        <div className="border border-[#C71585] rounded p-2 bg-white">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Add a category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow p-2 border-none text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#5E60CE]"
            />
            <button
              onClick={addCategory}
              className="ml-2 p-2 bg-[#5E60CE] hover:bg-[#7209B7] text-white rounded transition-colors duration-300"
              type="button"
            >
              <FaPlus />
            </button>
          </div>

          {/* Display existing categories */}
          <div className="mt-2 flex flex-wrap gap-2">
            {blogDetails.categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center bg-[#f0e6fa] px-3 py-1 rounded-full text-sm"
              >
                <span className="text-black">{category}</span>
                <button
                  onClick={() => removeCategory(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                  type="button"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
            {blogDetails.categories.length === 0 && (
              <p className="text-gray-500 text-sm">No categories added yet</p>
            )}
          </div>
        </div>

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

        {/* Show current featured image if editing */}
        {isEditing && blogImageUrl && !blogImageUrl.startsWith("blob:") && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-1">
              Current featured image:
            </p>
            <div className="h-24 w-full relative rounded overflow-hidden">
              <img
                src={blogImageUrl}
                alt="Current featured image"
                className="h-full w-auto object-contain"
              />
            </div>
          </div>
        )}
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
          style: { color: "black", backgroundColor: "#c7d2fe" },
        }}
        visibleDragbar={false}
        data-color-mode="light" // Correct way to set the color mode
        style={{ backgroundColor: "#c7d2fe", color: "black" }}
      />

      <div className="mt-4 p-4 bg-[#FDFDFD] shadow rounded border border-[#C71585]">
        <h3 className="text-[#5E60CE] mb-2 font-semibold">Content Preview</h3>
        <MarkdownPreview
          source={value}
          wrapperElement={{ "data-color-mode": "light" }}
          style={{ backgroundColor: "#c7d2fe", color: "black" }}
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
                  className={`w-full h-full object-cover transition-transform duration-300`}
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
            <p className="text-[#5E60CE] mb-2">
              By {blogDetails.author || "Author Name"}
            </p>

            {/* Categories display */}
            <div className="mb-3 flex flex-wrap gap-1">
              {blogDetails.categories.length > 0 ? (
                blogDetails.categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-[#f0e6fa] text-[#000000] text-xs rounded-full"
                  >
                    {category}
                  </span>
                ))
              ) : (
                <span className="text-black text-sm">No categories</span>
              )}
            </div>

            <div className="line-clamp-3 text-[#1C1C1C]">
              <MarkdownPreview
                source={value}
                wrapperElement={{ "data-color-mode": "light" }}
                style={{ backgroundColor: "white", color: "black" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <Link href="/dashboard/blogs">
          <button
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors duration-300"
            disabled={isUploading}
          >
            Cancel
          </button>
        </Link>
        <button
          className="px-4 py-2 bg-[#5E60CE] hover:bg-[#7209B7] text-white rounded transition-colors duration-300"
          onClick={onSave}
          disabled={isUploading}
        >
          {isUploading
            ? "Uploading..."
            : isEditing
            ? "Update Blog"
            : "Save Blog"}
        </button>
      </div>
    </div>
  );
}
