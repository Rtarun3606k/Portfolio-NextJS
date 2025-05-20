"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaTimes } from "react-icons/fa";
import Image from "next/image";

export default function PositionForm({ initialData, isEditing = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(initialData?.logoUrl || null);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef(null);
  const [responsibilityInput, setResponsibilityInput] = useState("");

  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || "",
    jobTitle: initialData?.jobTitle || "",
    employmentType: initialData?.employmentType || "Full-time",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    isCurrent: initialData?.isCurrent || false,
    location: initialData?.location || "",
    isRemote: initialData?.isRemote || false,
    responsibilities: initialData?.responsibilities || [],
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file selection with preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        content: "Please select an image file",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        content: "Image file is too large. Maximum size is 5MB",
      });
      return;
    }

    setLogoFile(file);
    setUploadStatus("File selected: " + file.name);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle adding responsibility
  const handleResponsibilityKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addResponsibility();
    }
  };

  const addResponsibility = () => {
    if (responsibilityInput.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [
          ...prev.responsibilities,
          responsibilityInput.trim(),
        ],
      }));
      setResponsibilityInput("");
    }
  };

  const removeResponsibility = (responsibility) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter(
        (r) => r !== responsibility
      ),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", content: "" });

    try {
      // Validate required fields
      if (
        !formData.companyName ||
        !formData.jobTitle ||
        !formData.employmentType ||
        !formData.startDate ||
        !formData.location ||
        formData.responsibilities.length === 0
      ) {
        throw new Error("Please fill all required fields");
      }

      // Validate end date logic
      if (!formData.isCurrent && !formData.endDate) {
        throw new Error(
          "Please provide an end date or mark as current position"
        );
      }

      // Create FormData object for multipart/form-data (for logo upload)
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "responsibilities") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append logo file if exists
      if (logoFile) {
        console.log("Appending logo file:", logoFile.name);
        formDataToSend.append("logo", logoFile);
      }

      // URL for API endpoint
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/positions/${initialData._id}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/positions`;

      // Send data to API endpoint
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          content: isEditing
            ? "Position updated successfully!"
            : "Position created successfully!",
        });

        // Reset form if not editing
        if (!isEditing) {
          setFormData({
            companyName: "",
            jobTitle: "",
            employmentType: "Full-time",
            startDate: "",
            endDate: "",
            isCurrent: false,
            location: "",
            isRemote: false,
            responsibilities: [],
          });
          setLogoFile(null);
          setLogoPreview(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/dashboard/positions");
        }, 1500);
      } else {
        throw new Error(data.error || "Failed to save position");
      }
    } catch (error) {
      console.error("Error submitting position:", error);
      setMessage({
        type: "error",
        content: error.message || "An error occurred while saving the position",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-white to-purple-50">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#1F1F1F] mb-2">
          {isEditing ? "Edit Position" : "Add New Position"}
        </h1>
        <p className="text-gray-600">
          {isEditing
            ? "Update your work experience details"
            : "Add your work experience to showcase on your portfolio"}
        </p>
      </div>

      {message.content && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {message.content}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg order-2 lg:order-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#6A0DAD] border-b border-[#6A0DAD]/20 pb-2">
                Company Information
              </h2>

              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                  placeholder="e.g. Acme Corporation"
                />
              </div>

              <div>
                <label
                  htmlFor="logo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company Logo
                </label>
                <input
                  type="file"
                  id="logo"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                />
                {uploadStatus && (
                  <p className="mt-1 text-sm text-blue-600">{uploadStatus}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: Square image, max size 5MB
                </p>
              </div>
            </div>

            {/* Role Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#6A0DAD] border-b border-[#6A0DAD]/20 pb-2">
                Role Details
              </h2>

              <div>
                <label
                  htmlFor="jobTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Job Title *
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div>
                <label
                  htmlFor="employmentType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Employment Type *
                </label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            {/* Date Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#6A0DAD] border-b border-[#6A0DAD]/20 pb-2">
                Date Information
              </h2>

              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                />
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isCurrent"
                  name="isCurrent"
                  checked={formData.isCurrent}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#6A0DAD] focus:ring-[#6A0DAD]"
                />
                <label
                  htmlFor="isCurrent"
                  className="ml-2 text-sm text-gray-700"
                >
                  I currently work here
                </label>
              </div>

              {!formData.isCurrent && (
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required={!formData.isCurrent}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                  />
                </div>
              )}
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#6A0DAD] border-b border-[#6A0DAD]/20 pb-2">
                Location Information
              </h2>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRemote"
                  name="isRemote"
                  checked={formData.isRemote}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#6A0DAD] focus:ring-[#6A0DAD]"
                />
                <label
                  htmlFor="isRemote"
                  className="ml-2 text-sm text-gray-700"
                >
                  This is a remote position
                </label>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#6A0DAD] border-b border-[#6A0DAD]/20 pb-2">
                Responsibilities *
              </h2>

              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    value={responsibilityInput}
                    onChange={(e) => setResponsibilityInput(e.target.value)}
                    onKeyDown={handleResponsibilityKeyDown}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                    placeholder="e.g. Led a team of 5 developers"
                  />
                  <button
                    type="button"
                    onClick={addResponsibility}
                    className="px-4 py-2 bg-[#6A0DAD] text-white rounded-r-lg hover:bg-[#7209B7]"
                  >
                    <FaPlus />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1 mb-2">
                  Press Enter or click the plus button to add
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.responsibilities.map((responsibility, index) => (
                    <span
                      key={index}
                      className="bg-[#6A0DAD]/10 text-[#6A0DAD] text-sm px-3 py-1 rounded-full flex items-center"
                    >
                      {responsibility}
                      <button
                        type="button"
                        onClick={() => removeResponsibility(responsibility)}
                        className="ml-1 text-[#6A0DAD] hover:text-[#7209B7]"
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED] text-white font-medium rounded-lg transition-all hover:shadow-lg disabled:opacity-50"
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Position"
                  : "Create Position"}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="order-1 lg:order-2">
          <h2 className="text-xl font-bold text-[#1F1F1F] mb-4">
            Position Preview
          </h2>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
            {/* Header with company logo and info */}
            <div className="p-5 border-b border-gray-200 flex items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mr-4">
                {logoPreview ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={logoPreview}
                      alt="Company Logo"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-lg"
                    />
                  </div>
                ) : (
                  <span className="text-gray-400 text-xl font-light">
                    {formData.companyName ? formData.companyName[0] : "C"}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  {formData.companyName || "Company Name"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {formData.location || "Location"}
                  {formData.isRemote && " (Remote)"}
                </p>
              </div>
            </div>

            {/* Job details */}
            <div className="p-5">
              <div className="mb-4">
                <h3 className="font-semibold text-[#1F1F1F]">
                  {formData.jobTitle || "Job Title"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {formData.employmentType || "Employment Type"}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {formData.startDate
                    ? new Date(formData.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "Start Date"}{" "}
                  -{" "}
                  {formData.isCurrent
                    ? "Present"
                    : formData.endDate
                    ? new Date(formData.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "End Date"}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-[#1F1F1F] mb-2">
                  Responsibilities:
                </h4>
                {formData.responsibilities.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {formData.responsibilities.map((resp, index) => (
                      <li key={index} className="text-gray-700 text-sm">
                        {resp}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm italic">
                    Add responsibilities to see them here
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
