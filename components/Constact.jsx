"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getData, storeData } from "@/_utils/LocalStorage";
// Assuming this is where your localStorage functions are

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    type: "professional", // Default value
    description: "",
    serviceId: "", // New field for selected service
    appointmentDate: "", // New field for appointment date
    appointmentTime: "", // New field for appointment time
    serviceName: "",
  });

  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState(null); // null, 'submitting', 'success', 'error'
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from localStorage or API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        if (getData("services") !== null) {
          const data = getData("services");
          // console.log("Fetched services from localStorage:", data);
          setServices(data);
        } else {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/services`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          // console.log("Fetched services:", data.services);
          storeData("services", data.services);
          setServices(data.services);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Validate first name (required)
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Validate last name (required)
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Validate email (required and format)
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate description (required and minimum length)
    if (!formData.description.trim()) {
      newErrors.description = "Message is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Message should be at least 10 characters";
    }

    // If user selected a service, validate appointment details
    if (formData.serviceId) {
      if (!formData.appointmentDate) {
        newErrors.appointmentDate = "Please select a preferred date";
      }

      if (!formData.appointmentTime) {
        newErrors.appointmentTime = "Please select a preferred time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear specific error when user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // In the handleSubmit function, modify the form data preparation
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setFormStatus("submitting");

      try {
        // Get service details if a service is selected
        const selectedService = services.find(
          (service) => service._id === formData.serviceId
        );

        // Create a FormData object with all required fields
        const formDataObj = new FormData();

        // Add basic form fields
        formDataObj.append("firstName", formData.firstName);
        formDataObj.append("lastName", formData.lastName);
        formDataObj.append("email", formData.email);
        formDataObj.append("type", formData.type);
        formDataObj.append("description", formData.description);
        formDataObj.append(
          "name",
          `${formData.firstName} ${formData.lastName}`
        );

        // Add service-related fields if a service is selected
        if (selectedService) {
          formDataObj.append("serviceId", selectedService._id);
          formDataObj.append("serviceName", selectedService.title); // Add service title
          formDataObj.append("serviceTimeframe", selectedService.timeframe); // Add service timeframe
          formDataObj.append("serviceDescription", selectedService.description); // Add service description
          formDataObj.append("servicePrice", selectedService.price); // Add service price

          // Add appointment details if provided
          if (formData.appointmentDate) {
            formDataObj.append("appointmentDate", formData.appointmentDate);
          }

          if (formData.appointmentTime) {
            formDataObj.append("appointmentTime", formData.appointmentTime);
          }
        }

        // Send the request
        // console.log("Sending form data:", formData);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/Contact`,
          {
            method: "POST",
            // Do NOT set Content-Type when using FormData
            body: formDataObj,
          }
        );
        // console.log("Sending form data obj:", formDataObj);

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        // console.log("Form submitted successfully:", data);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setFormStatus("success");
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          type: "professional",
          description: "",
          serviceId: "",
          appointmentDate: "",
          appointmentTime: "",
        });

        // Reset success status after 3 seconds
        setTimeout(() => setFormStatus(null), 3000);
      } catch (error) {
        console.error("Error submitting form:", error);
        setFormStatus("error");
      }
    }
  };

  // Get available dates (next 14 days excluding weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      // Skip weekends (0 is Sunday, 6 is Saturday)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }

    return dates;
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Available time slots
  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ];

  // Get the selected service
  const selectedService = services.find(
    (service) => service._id === formData.serviceId
  );

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-br from-[#E8EAF6] via-[#E0E7FF] to-[#EDE9FE]">
      {/* Enhanced decorative circles with blur effect */}
      <div className="absolute top-10 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#6A0DAD]/10 to-[#FF4ECD]/10 blur-3xl opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#FF4ECD]/10 to-[#6A0DAD]/10 blur-3xl opacity-40"></div>

      {/* Background circles positioned behind the entire component */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Larger circles with blur effects */}
        <div className="animate-float absolute top-[10%] left-[5%] w-32 h-32 bg-gradient-to-r from-[#5E60CE]/20 to-[#7209B7]/20 rounded-full blur-lg"></div>
        <div className="animate-float-delayed absolute top-[30%] right-[10%] w-40 h-40 bg-gradient-to-r from-[#7209B7]/20 to-[#E6CCE4]/30 rounded-full blur-lg"></div>
        <div className="animate-float-slow absolute bottom-[15%] left-[15%] w-36 h-36 bg-gradient-to-r from-[#C71585]/10 to-[#5E60CE]/20 rounded-full blur-lg"></div>

        {/* Medium circles with different animations */}
        <div className="animate-float-reverse absolute top-[45%] left-[25%] w-28 h-28 bg-gradient-to-br from-[#E6CCE4]/20 to-[#5E60CE]/10 rounded-full blur-md"></div>
        <div className="animate-float-diagonal absolute top-[20%] left-[70%] w-24 h-24 bg-gradient-to-bl from-[#7209B7]/10 to-[#C71585]/20 rounded-full blur-md"></div>
        <div className="animate-float-circular absolute bottom-[35%] right-[25%] w-36 h-36 bg-gradient-to-tr from-[#5E60CE]/20 to-[#E6CCE4]/20 rounded-full blur-lg"></div>

        {/* Smaller accent circles */}
        <div className="animate-pulsate absolute top-[65%] right-[12%] w-28 h-28 bg-gradient-to-r from-[#C71585]/10 to-[#5E60CE]/20 rounded-full blur-md"></div>
        <div className="animate-float-diagonal-reverse absolute top-[8%] left-[50%] w-20 h-20 bg-gradient-to-r from-[#E6CCE4]/20 to-[#7209B7]/10 rounded-full blur-sm"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold font-poppins text-[#1F1F1F] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED]"
          >
            Get In Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#6B7280] font-inter max-w-2xl mx-auto"
          >
            Have a question or want to work together? Drop me a message!
          </motion.p>
        </div>

        {/* Contact Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-[#6A0DAD]/10"
        >
          <div className="p-8">
            {formStatus === "success" ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600 mb-6">
                  {formData.serviceId
                    ? "Your appointment request has been received. I'll confirm the details with you shortly!"
                    : "Your message has been sent successfully. I'll get back to you soon!"}
                </p>
                <button
                  onClick={() => setFormStatus(null)}
                  className="px-6 py-2 bg-[#6A0DAD] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all`}
                      placeholder="Jane"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Student/Professional Radio */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    You are a
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="professional"
                        name="type"
                        value="professional"
                        checked={formData.type === "professional"}
                        onChange={handleChange}
                        className="h-5 w-5 text-[#6A0DAD] focus:ring-[#6A0DAD] cursor-pointer"
                      />
                      <label
                        htmlFor="professional"
                        className="ml-2 text-gray-700 cursor-pointer"
                      >
                        Professional
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="student"
                        name="type"
                        value="student"
                        checked={formData.type === "student"}
                        onChange={handleChange}
                        className="h-5 w-5 text-[#6A0DAD] focus:ring-[#6A0DAD] cursor-pointer"
                      />
                      <label
                        htmlFor="student"
                        className="ml-2 text-gray-700 cursor-pointer"
                      >
                        Student
                      </label>
                    </div>
                  </div>
                </div>

                {/* Service Selection */}
                <div className="mb-6">
                  <label
                    htmlFor="serviceId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Select a Service (Optional)
                  </label>
                  <div className="relative">
                    <select
                      id="serviceId"
                      name="serviceId"
                      value={formData.serviceId}
                      onChange={handleChange}
                      className="block text-black w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all appearance-none"
                    >
                      <option value="">-- Select a service --</option>
                      {loading ? (
                        <option disabled>Loading services...</option>
                      ) : (
                        services.map((service) => (
                          <option key={service._id} value={service._id}>
                            {service.title} ({service.price})
                          </option>
                        ))
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Show selected service details */}
                  {selectedService && (
                    <div className="mt-3 p-3 bg-[#6A0DAD]/5 rounded-lg">
                      <div className="flex items-start">
                        <div className="text-[#6A0DAD] mt-1 mr-3">
                          {selectedService.iconPath && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: selectedService.iconPath,
                              }}
                            />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {selectedService.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedService.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span>Price: {selectedService.price}</span>
                            <span>Timeframe: {selectedService.timeframe}</span>
                            <span className="capitalize">
                              Category: {selectedService.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Appointment booking fields (only shown when service is selected) */}
                {formData.serviceId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 p-4 bg-[#6A0DAD]/5 rounded-lg"
                  >
                    <h3 className="font-medium text-gray-900 mb-3">
                      Book an Appointment
                    </h3>

                    {/* Date Selection */}
                    <div className="mb-4">
                      <label
                        htmlFor="appointmentDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Preferred Date <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="appointmentDate"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border text-black ${
                          errors.appointmentDate
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all`}
                      >
                        <option value="" className="text-black">
                          Select a date
                        </option>
                        {getAvailableDates().map((date, index) => (
                          <option
                            key={index}
                            value={date.toISOString().split("T")[0]}
                          >
                            {formatDate(date)}
                          </option>
                        ))}
                      </select>
                      {errors.appointmentDate && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.appointmentDate}
                        </p>
                      )}
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label
                        htmlFor="appointmentTime"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Preferred Time <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="appointmentTime"
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border text-black ${
                          errors.appointmentTime
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all`}
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      {errors.appointmentTime && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.appointmentTime}
                        </p>
                      )}
                    </div>

                    <p className="mt-3 text-xs text-gray-500">
                      Note: All appointments are in Eastern Standard Time (EST).
                      After submission, I'll confirm availability or suggest
                      alternative times if needed.
                    </p>
                  </motion.div>
                )}

                {/* Description */}
                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border text-black placeholder:text-gray-400 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all resize-none`}
                    placeholder={
                      formData.serviceId
                        ? "Tell me about your project requirements, any specific needs, or questions about the selected service..."
                        : "Tell me about your project, question or opportunity..."
                    }
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    className={`inline-flex items-center justify-center px-8 py-3 rounded-lg text-white font-medium transition-all
                    ${
                      formStatus === "submitting"
                        ? "bg-[#6A0DAD]/70 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#6A0DAD] to-[#7C3AED] hover:shadow-lg hover:scale-[1.02]"
                    }`}
                  >
                    {formStatus === "submitting" ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        {formData.serviceId
                          ? "Request Appointment"
                          : "Submit Message"}
                        <svg
                          className="w-5 h-5 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          ></path>
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {formStatus === "error" && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-center">
                    Something went wrong. Please try again later.
                  </div>
                )}
              </form>
            )}
          </div>
        </motion.div>

        {/* Alternative Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-3xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Email */}
          <div className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-md flex flex-col items-center text-center border border-[#6A0DAD]/5 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#6A0DAD]/10 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#6A0DAD]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Email</h3>
            <a
              href="mailto:r.tarunnayaka25042005@gmail.com"
              className="text-[#6A0DAD] hover:text-[#7C3AED] flex flex-grow "
            >
              r.tarunnayaka25042005{"\n"}@gmail.com
            </a>
          </div>

          {/* LinkedIn */}
          <div className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-md flex flex-col items-center text-center border border-[#6A0DAD]/5 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#6A0DAD]/10 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#6A0DAD]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">LinkedIn</h3>
            <a
              href="https://www.linkedin.com/in/tarun-nayaka-r-28612a27a/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6A0DAD] hover:text-[#7C3AED]"
            >
              linkedin.com/in/tarun-nayaka-r-28612a27a/
            </a>
          </div>

          {/* GitHub */}
          <div className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-md flex flex-col items-center text-center border border-[#6A0DAD]/5 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#6A0DAD]/10 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#6A0DAD]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">GitHub</h3>
            <a
              href="https://github.com/Rtarun3606k"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6A0DAD] hover:text-[#7C3AED]"
            >
              github.com/Rtarun3606k
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
