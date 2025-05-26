"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AtSymbolIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

// Newsletter Dashboard Component
export default function NewsletterDashboard() {
  // State variables
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    inactiveSubscribers: 0,
    totalNewslettersSent: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isSendingToAll, setIsSendingToAll] = useState(false);
  const [notification, setNotification] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);
  const [sendingProgress, setSendingProgress] = useState({ sent: 0, total: 0 });

  const router = useRouter();

  // Fetch subscribers
  const fetchSubscribers = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/newsletter/subscribers?page=${page}&limit=${limit}`
      );
      const data = await response.json();

      if (data.success) {
        setSubscribers(data.data.subscribers);
        setPagination(data.data.pagination);

        // Calculate stats
        const totalActive = data.data.subscribers.filter(
          (s) => s.isActive !== false
        ).length;
        const totalInactive = data.data.subscribers.filter(
          (s) => s.isActive === false
        ).length;
        const totalSent = data.data.subscribers.reduce(
          (total, sub) => total + (sub.newslettersSent || 0),
          0
        );

        setStats({
          totalSubscribers: data.data.pagination.totalCount,
          activeSubscribers: data.data.pagination.totalCount - totalInactive,
          inactiveSubscribers: totalInactive,
          totalNewslettersSent: totalSent,
        });
      } else {
        showNotification("Error fetching subscribers", "error");
      }
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      showNotification("Error fetching subscribers", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Get newsletter preview
  const getNewsletterPreview = async () => {
    try {
      setIsLoadingPreview(true);
      const response = await fetch("/api/newsletter/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "preview" }),
      });
      const data = await response.json();

      if (data.success) {
        setPreviewData(data.data);
        setShowPreview(true);
      } else {
        showNotification(`Preview error: ${data.error}`, "error");
      }
    } catch (error) {
      console.error("Failed to get preview:", error);
      showNotification("Error generating preview", "error");
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Send test newsletter
  const sendTestNewsletter = async () => {
    if (!testEmail || !validateEmail(testEmail)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    try {
      setIsSendingTest(true);
      const response = await fetch("/api/newsletter/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test",
          testEmail,
        }),
      });
      const data = await response.json();

      if (data.success) {
        showNotification(`Test newsletter sent to ${testEmail}`, "success");
        setTestEmail("");
      } else {
        showNotification(`Failed to send test: ${data.error}`, "error");
      }
    } catch (error) {
      console.error("Failed to send test newsletter:", error);
      showNotification("Error sending test newsletter", "error");
    } finally {
      setIsSendingTest(false);
    }
  };

  // Send newsletter to specific subscriber
  const sendNewsletterToSubscriber = async (userId) => {
    try {
      const subscriberIndex = subscribers.findIndex((s) => s._id === userId);
      if (subscriberIndex === -1) return;

      const updatedSubscribers = [...subscribers];
      updatedSubscribers[subscriberIndex] = {
        ...updatedSubscribers[subscriberIndex],
        isSending: true,
      };
      setSubscribers(updatedSubscribers);

      const response = await fetch("/api/newsletter/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_to_user",
          userId,
        }),
      });
      const data = await response.json();

      // Update subscriber in list
      const newSubscribers = [...subscribers];
      newSubscribers[subscriberIndex] = {
        ...newSubscribers[subscriberIndex],
        isSending: false,
        lastNewsletterSent: data.success
          ? new Date().toISOString()
          : newSubscribers[subscriberIndex].lastNewsletterSent,
        newslettersSent: data.success
          ? (newSubscribers[subscriberIndex].newslettersSent || 0) + 1
          : newSubscribers[subscriberIndex].newslettersSent || 0,
      };
      setSubscribers(newSubscribers);

      if (data.success) {
        showNotification(
          `Newsletter sent to ${newSubscribers[subscriberIndex].email}`,
          "success"
        );

        // Update stats
        setStats((prev) => ({
          ...prev,
          totalNewslettersSent: prev.totalNewslettersSent + 1,
        }));
      } else {
        showNotification(`Failed to send newsletter: ${data.error}`, "error");
      }
    } catch (error) {
      console.error("Failed to send newsletter to subscriber:", error);
      showNotification("Error sending newsletter", "error");

      // Reset sending state
      const subscriberIndex = subscribers.findIndex((s) => s._id === userId);
      if (subscriberIndex !== -1) {
        const newSubscribers = [...subscribers];
        newSubscribers[subscriberIndex] = {
          ...newSubscribers[subscriberIndex],
          isSending: false,
        };
        setSubscribers(newSubscribers);
      }
    }
  };

  // Send newsletter to all subscribers
  const sendNewsletterToAll = async () => {
    try {
      setIsSendingToAll(true);
      setSendingProgress({ sent: 0, total: stats.activeSubscribers });

      const response = await fetch("/api/newsletter/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_to_all" }),
      });
      const data = await response.json();

      if (data.success) {
        showNotification(
          `Newsletter sent to ${data.data.sent} subscribers. ${
            data.data.failed > 0 ? `Failed: ${data.data.failed}` : ""
          }`,
          data.data.failed > 0 ? "warning" : "success"
        );

        // Update stats
        setStats((prev) => ({
          ...prev,
          totalNewslettersSent: prev.totalNewslettersSent + data.data.sent,
        }));

        // Refresh the subscriber list to get updated info
        fetchSubscribers(pagination.currentPage, pagination.limit);
      } else {
        showNotification(`Failed to send newsletters: ${data.error}`, "error");
      }
    } catch (error) {
      console.error("Failed to send newsletters:", error);
      showNotification("Error sending newsletters", "error");
    } finally {
      setIsSendingToAll(false);
      setSendingProgress({ sent: 0, total: 0 });
    }
  };

  // Toggle subscriber active status
  const toggleSubscriberStatus = async (userId, currentStatus) => {
    try {
      const subscriberIndex = subscribers.findIndex((s) => s._id === userId);
      if (subscriberIndex === -1) return;

      const updatedSubscribers = [...subscribers];
      updatedSubscribers[subscriberIndex] = {
        ...updatedSubscribers[subscriberIndex],
        isUpdating: true,
      };
      setSubscribers(updatedSubscribers);

      const response = await fetch("/api/newsletter/subscribers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          isActive: !currentStatus,
        }),
      });
      const data = await response.json();

      if (data.success) {
        // Update subscriber in list
        const newSubscribers = [...subscribers];
        newSubscribers[subscriberIndex] = {
          ...newSubscribers[subscriberIndex],
          isActive: !currentStatus,
          isUpdating: false,
        };
        setSubscribers(newSubscribers);

        // Update stats
        setStats((prev) => ({
          ...prev,
          activeSubscribers: !currentStatus
            ? prev.activeSubscribers + 1
            : prev.activeSubscribers - 1,
          inactiveSubscribers: !currentStatus
            ? prev.inactiveSubscribers - 1
            : prev.inactiveSubscribers + 1,
        }));

        showNotification(
          `Subscriber ${
            !currentStatus ? "activated" : "deactivated"
          } successfully`,
          "success"
        );
      } else {
        const newSubscribers = [...subscribers];
        newSubscribers[subscriberIndex] = {
          ...newSubscribers[subscriberIndex],
          isUpdating: false,
        };
        setSubscribers(newSubscribers);
        showNotification(`Failed to update subscriber: ${data.error}`, "error");
      }
    } catch (error) {
      console.error("Failed to toggle subscriber status:", error);
      showNotification("Error updating subscriber status", "error");

      // Reset updating state
      const subscriberIndex = subscribers.findIndex((s) => s._id === userId);
      if (subscriberIndex !== -1) {
        const newSubscribers = [...subscribers];
        newSubscribers[subscriberIndex] = {
          ...newSubscribers[subscriberIndex],
          isUpdating: false,
        };
        setSubscribers(newSubscribers);
      }
    }
  };

  // Delete subscriber
  const deleteSubscriber = async () => {
    if (!subscriberToDelete) return;

    try {
      const response = await fetch(
        `/api/newsletter/subscribers?userId=${subscriberToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        // Remove from list and update stats
        const updatedSubscribers = subscribers.filter(
          (s) => s._id !== subscriberToDelete
        );
        setSubscribers(updatedSubscribers);

        const deletedSubscriber = subscribers.find(
          (s) => s._id === subscriberToDelete
        );
        setStats((prev) => ({
          ...prev,
          totalSubscribers: prev.totalSubscribers - 1,
          activeSubscribers:
            deletedSubscriber && deletedSubscriber.isActive !== false
              ? prev.activeSubscribers - 1
              : prev.activeSubscribers,
          inactiveSubscribers:
            deletedSubscriber && deletedSubscriber.isActive === false
              ? prev.inactiveSubscribers - 1
              : prev.inactiveSubscribers,
        }));

        showNotification("Subscriber deleted successfully", "success");
      } else {
        showNotification(`Failed to delete subscriber: ${data.error}`, "error");
      }
    } catch (error) {
      console.error("Failed to delete subscriber:", error);
      showNotification("Error deleting subscriber", "error");
    } finally {
      setShowDeleteModal(false);
      setSubscriberToDelete(null);
    }
  };

  // Helper - Show notification
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Helper - Validate email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Helper - Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  // Change page
  const changePage = (page) => {
    fetchSubscribers(page, pagination.limit);
  };

  // Load data on initial render
  useEffect(() => {
    fetchSubscribers(1, 10);
  }, [fetchSubscribers]);

  return (
    <div className="container py-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Newsletter Dashboard
        </h1>
        <p className="text-gray-500">
          Manage your newsletter subscribers and send updates
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Subscribers"
          value={stats.totalSubscribers}
          icon={<UserGroupIcon className="h-6 w-6" />}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Active Subscribers"
          value={stats.activeSubscribers}
          icon={<CheckCircleIcon className="h-6 w-6" />}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Inactive Subscribers"
          value={stats.inactiveSubscribers}
          icon={<XCircleIcon className="h-6 w-6" />}
          color="bg-red-100 text-red-600"
        />
        <StatCard
          title="Total Newsletters Sent"
          value={stats.totalNewslettersSent}
          icon={<EnvelopeIcon className="h-6 w-6" />}
          color="bg-blue-100 text-blue-600"
        />
      </div>

      {/* Actions Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Preview & Test Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Preview & Test Newsletter</h2>

          <div className="mb-6">
            <button
              onClick={getNewsletterPreview}
              disabled={isLoadingPreview}
              className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition mb-4"
            >
              {isLoadingPreview ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                  Loading Preview...
                </>
              ) : (
                <>
                  <EyeIcon className="h-5 w-5 mr-2" />
                  Preview Newsletter Content
                </>
              )}
            </button>

            <div className="flex items-center">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Email for test newsletter"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={sendTestNewsletter}
                disabled={isSendingTest || !testEmail}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-r-md transition disabled:opacity-50"
              >
                {isSendingTest ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  "Send Test"
                )}
              </button>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Mass Send Newsletter</h3>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to send the newsletter to all ${stats.activeSubscribers} active subscribers?`
                  )
                ) {
                  sendNewsletterToAll();
                }
              }}
              disabled={isSendingToAll || stats.activeSubscribers === 0}
              className="flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-4 rounded-md transition disabled:opacity-50"
            >
              {isSendingToAll ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                  Sending...{" "}
                  {sendingProgress.sent > 0
                    ? `(${sendingProgress.sent}/${sendingProgress.total})`
                    : ""}
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                  Send to All Subscribers ({stats.activeSubscribers})
                </>
              )}
            </button>
          </div>
        </div>

        {/* Newsletter Preview Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Newsletter Content</h2>

          {previewData ? (
            <div className="overflow-auto max-h-[350px]">
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">
                  Blog Posts ({previewData.blogs.length})
                </h3>
                {previewData.blogs.length > 0 ? (
                  <div className="space-y-3">
                    {previewData.blogs.map((blog) => (
                      <div
                        key={blog.id}
                        className="border border-gray-200 rounded-md p-3"
                      >
                        <h4 className="font-medium">{blog.title}</h4>
                        <div className="text-sm text-gray-500">
                          {blog.excerpt}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No blog posts available
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Events ({previewData.events.length})
                </h3>
                {previewData.events.length > 0 ? (
                  <div className="space-y-3">
                    {previewData.events.map((event) => (
                      <div
                        key={event.id}
                        className="border border-gray-200 rounded-md p-3"
                      >
                        <h4 className="font-medium">{event.name}</h4>
                        <div className="text-sm text-gray-500 mb-1">
                          <span className="inline-block mr-3">
                            {event.date}
                          </span>{" "}
                          •
                          <span className="inline-block ml-3">
                            {event.location}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.description}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No upcoming events available
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
              <DocumentTextIcon className="h-16 w-16 mb-4" />
              <p>
                Click "Preview Newsletter Content" to see what will be included
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Subscribers List</h2>
          <p className="text-gray-500">Manage your newsletter subscribers</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Newsletter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Newsletters Sent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    <ArrowPathIcon className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading subscribers...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No subscribers found
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr
                    key={subscriber._id}
                    className={
                      subscriber.isActive === false ? "bg-gray-100" : ""
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center">
                        <AtSymbolIcon className="h-5 w-5 mr-2 text-gray-400" />
                        {subscriber.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subscriber.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          subscriber.isActive === false
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {subscriber.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDate(subscriber.lastNewsletterSent)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {subscriber.newslettersSent || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {formatDate(subscriber.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {/* Send Newsletter Button */}
                      <button
                        onClick={() =>
                          sendNewsletterToSubscriber(subscriber._id)
                        }
                        disabled={
                          subscriber.isSending || subscriber.isActive === false
                        }
                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          subscriber.isActive === false
                            ? "Cannot send to inactive subscriber"
                            : "Send newsletter"
                        }
                      >
                        {subscriber.isSending ? (
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        ) : (
                          <PaperAirplaneIcon className="h-5 w-5" />
                        )}
                      </button>

                      {/* Toggle Status Button */}
                      <button
                        onClick={() =>
                          toggleSubscriberStatus(
                            subscriber._id,
                            subscriber.isActive !== false
                          )
                        }
                        disabled={subscriber.isUpdating}
                        className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                        title={
                          subscriber.isActive === false
                            ? "Activate subscriber"
                            : "Deactivate subscriber"
                        }
                      >
                        {subscriber.isUpdating ? (
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        ) : subscriber.isActive === false ? (
                          <CheckCircleIcon className="h-5 w-5" />
                        ) : (
                          <XCircleIcon className="h-5 w-5" />
                        )}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          setSubscriberToDelete(subscriber._id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete subscriber"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && subscribers.length > 0 && pagination.totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalCount
              )}{" "}
              of {pagination.totalCount} subscribers
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => changePage(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  // Show pages around the current page
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else {
                    const middle = Math.min(
                      Math.max(3, pagination.currentPage),
                      pagination.totalPages - 2
                    );
                    pageNum = i + middle - 2;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => changePage(pageNum)}
                      className={`px-3 py-1 border rounded-md text-sm ${
                        pagination.currentPage === pageNum
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                onClick={() => changePage(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 flex items-center justify-between ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border-l-4 border-green-500"
              : notification.type === "error"
              ? "bg-red-100 text-red-800 border-l-4 border-red-500"
              : notification.type === "warning"
              ? "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500"
              : "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
          }`}
        >
          {notification.type === "success" && (
            <CheckCircleIcon className="h-5 w-5 mr-2" />
          )}
          {notification.type === "error" && (
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          )}
          {notification.type === "warning" && (
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          )}
          {notification.type === "info" && (
            <EnvelopeIcon className="h-5 w-5 mr-2" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Subscriber
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this subscriber? This
                      action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={deleteSubscriber}
              >
                Delete
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSubscriberToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
      <div className={`p-3 rounded-full ${color} mr-4`}>{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
