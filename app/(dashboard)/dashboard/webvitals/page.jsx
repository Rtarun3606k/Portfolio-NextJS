"use client";

import { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, subDays } from "date-fns";
import { AlertCircle, Info } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Web Vitals thresholds based on Google's recommendations
const webVitalsThresholds = {
  LCP: { good: 2500, poor: 4000 }, // milliseconds
  CLS: { good: 0.1, poor: 0.25 }, // unitless
  FID: { good: 100, poor: 300 }, // milliseconds
  INP: { good: 200, poor: 500 }, // milliseconds
  TTFB: { good: 800, poor: 1800 }, // milliseconds
  FCP: { good: 1800, poor: 3000 }, // milliseconds
};

// Helper function to determine status color based on web vital value
const getMetricStatus = (metric, value) => {
  const threshold = webVitalsThresholds[metric];
  if (!threshold) return { color: "#A855F7", status: "unknown" }; // Default purple for unknown metrics

  if (value <= threshold.good) {
    return { color: "#10B981", status: "good" }; // Green
  } else if (value <= threshold.poor) {
    return { color: "#F59E0B", status: "needs-improvement" }; // Amber
  } else {
    return { color: "#EF4444", status: "poor" }; // Red
  }
};

// Formatters for values
const formatValue = (name, value) => {
  if (name === "CLS") return value.toFixed(3);
  return Math.round(value).toLocaleString();
};

// Description for each web vital
const metricDescriptions = {
  LCP: "Largest Contentful Paint measures loading performance. To provide a good user experience, LCP should occur within 2.5 seconds of page load.",
  CLS: "Cumulative Layout Shift measures visual stability. To provide a good user experience, pages should maintain a CLS of less than 0.1.",
  FID: "First Input Delay measures interactivity. To provide a good user experience, pages should have a FID of less than 100 milliseconds.",
  INP: "Interaction to Next Paint measures responsiveness. To provide a good user experience, pages should have an INP of 200 milliseconds or less.",
  TTFB: "Time to First Byte measures how long it takes for the server to respond. A good TTFB is under 800ms.",
  FCP: "First Contentful Paint measures when the first content appears. A good FCP is under 1.8 seconds.",
  page_view:
    "Records when a user viewed a page, measuring initial page load performance.",
};

export default function WebVitalsDashboard() {
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7days");
  const [selectedMetric, setSelectedMetric] = useState("LCP");
  const [activeTab, setActiveTab] = useState("overview");
  const [showTooltip, setShowTooltip] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/webvitals`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setMetrics(data.data);
      } catch (err) {
        console.error("Failed to fetch web vitals:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for time range
  const filteredData = useMemo(() => {
    if (!metrics || metrics.length === 0) return [];

    const now = new Date();
    const daysToSubtract =
      timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
    const compareDate = subDays(now, daysToSubtract);

    return metrics.filter((item) => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= compareDate;
    });
  }, [metrics, timeRange]);

  // Process data for overview metrics
  const overviewMetrics = useMemo(() => {
    if (filteredData.length === 0) return {};

    const metricTypes = ["LCP", "CLS", "FID", "INP", "TTFB", "FCP"];
    const results = {};

    metricTypes.forEach((type) => {
      const typeData = filteredData.filter((item) => item.name === type);
      if (typeData.length > 0) {
        const values = typeData.map((item) => item.value);
        const sum = values.reduce((acc, val) => acc + val, 0);
        const avg = sum / values.length;

        results[type] = {
          avg,
          count: values.length,
          median: values.sort((a, b) => a - b)[Math.floor(values.length / 2)],
          p75: values.sort((a, b) => a - b)[Math.floor(values.length * 0.75)],
          min: Math.min(...values),
          max: Math.max(...values),
          status: getMetricStatus(type, avg),
        };
      }
    });

    return results;
  }, [filteredData]);

  // Process data for page performance
  const pagePerformance = useMemo(() => {
    if (filteredData.length === 0) return [];

    const pages = {};
    filteredData.forEach((item) => {
      if (!item.page) return;

      if (!pages[item.page]) {
        pages[item.page] = {
          path: item.page,
          viewCount: 0,
          metrics: {},
        };
      }

      if (item.name === "page_view") {
        pages[item.page].viewCount++;
      }

      if (!pages[item.page].metrics[item.name]) {
        pages[item.page].metrics[item.name] = [];
      }

      pages[item.page].metrics[item.name].push(item.value);
    });

    // Calculate averages for each metric
    Object.keys(pages).forEach((page) => {
      Object.keys(pages[page].metrics).forEach((metric) => {
        const values = pages[page].metrics[metric];
        const sum = values.reduce((acc, val) => acc + val, 0);
        pages[page].metrics[metric] = sum / values.length;
      });
    });

    return Object.values(pages)
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10); // Top 10 pages
  }, [filteredData]);

  // Process data for time series
  const timeSeriesData = useMemo(() => {
    if (filteredData.length === 0 || !selectedMetric) return [];

    const metricData = filteredData.filter(
      (item) => item.name === selectedMetric
    );

    // Group by day
    const dailyData = {};
    metricData.forEach((item) => {
      const date = format(new Date(item.timestamp), "yyyy-MM-dd");

      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          values: [],
        };
      }

      dailyData[date].values.push(item.value);
    });

    // Calculate daily averages
    return Object.keys(dailyData)
      .map((date) => {
        const values = dailyData[date].values;
        const average =
          values.reduce((sum, val) => sum + val, 0) / values.length;

        return {
          date,
          value: average,
          count: values.length,
        };
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredData, selectedMetric]);

  // Device & browser stats
  const deviceStats = useMemo(() => {
    if (filteredData.length === 0) return { browsers: [], devices: [] };

    const browsers = {};
    const devices = {};

    filteredData.forEach((item) => {
      if (!item.userAgent) return;

      // Extract browser
      let browser = "Unknown";
      if (item.userAgent.includes("Chrome")) browser = "Chrome";
      else if (item.userAgent.includes("Firefox")) browser = "Firefox";
      else if (
        item.userAgent.includes("Safari") &&
        !item.userAgent.includes("Chrome")
      )
        browser = "Safari";
      else if (item.userAgent.includes("Edge")) browser = "Edge";

      if (!browsers[browser]) browsers[browser] = 0;
      browsers[browser]++;

      // Extract device type based on screen size
      let deviceType = "Unknown";
      if (item.screenSize) {
        const width = parseInt(item.screenSize.split("x")[0]);
        if (width < 768) deviceType = "Mobile";
        else if (width < 1024) deviceType = "Tablet";
        else deviceType = "Desktop";
      }

      if (!devices[deviceType]) devices[deviceType] = 0;
      devices[deviceType]++;
    });

    return {
      browsers: Object.entries(browsers).map(([name, value]) => ({
        name,
        value,
      })),
      devices: Object.entries(devices).map(([name, value]) => ({
        name,
        value,
      })),
    };
  }, [filteredData]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="flex items-center mb-4 text-red-500">
          <AlertCircle className="mr-2" />
          <h2 className="text-xl font-bold">Error Loading Web Vitals Data</h2>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <p className="text-sm text-gray-500 max-w-md text-center">
          Please check your API endpoint configuration and ensure the server is
          running correctly.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-black">
          Web Vitals Dashboard
        </h1>
        <p className="text-black">
          Track and analyze Core Web Vitals metrics to improve your site's
          performance.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("pages")}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "pages"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Page Performance
            </button>
            <button
              onClick={() => setActiveTab("trends")}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "trends"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Trends
            </button>
            <button
              onClick={() => setActiveTab("devices")}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm ${
                activeTab === "devices"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Devices
            </button>
          </div>

          {/* Time range selector */}
          <div className="relative">
            <select
              id="timeRange"
              name="timeRange"
              className="bg-white text-black rounded-md border border-gray-300 shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white shadow rounded-lg overflow-hidden animate-pulse"
            >
              <div className="p-4 pb-2">
                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
              </div>
              <div className="p-4">
                <div className="h-8 w-1/2 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Web Vitals overview cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {Object.keys(overviewMetrics).map((metric) => {
                  const data = overviewMetrics[metric];
                  const { color, status } = data.status;

                  return (
                    <div
                      key={metric}
                      className="bg-white shadow rounded-lg overflow-hidden"
                      style={{ borderTop: `4px solid ${color}` }}
                    >
                      <div className="p-4 pb-2">
                        <div className="flex justify-between items-center">
                          <div className="text-lg font-medium flex items-center text-black">
                            {metric}
                            <div
                              className="relative ml-1 cursor-help"
                              onMouseEnter={() => setShowTooltip(metric)}
                              onMouseLeave={() => setShowTooltip(null)}
                            >
                              <Info className="h-4 w-4 text-gray-400" />
                              {showTooltip === metric && (
                                <div className="absolute left-0 top-full mt-2 w-80 bg-white shadow-lg rounded-md p-3 z-10 text-sm text-gray-600">
                                  {metricDescriptions[metric] ||
                                    "Performance metric tracked by web vitals."}
                                </div>
                              )}
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              status === "good"
                                ? "bg-green-100 text-green-800"
                                : status === "needs-improvement"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {status.replace("-", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Based on {data.count.toLocaleString()} measurements
                        </p>
                      </div>
                      <div className="p-4">
                        <div
                          className="text-3xl font-bold mb-2"
                          style={{ color }}
                        >
                          {formatValue(metric, data.avg)}
                          <span className="text-xs text-gray-500 ml-1 font-normal">
                            {metric === "CLS" ? "" : "ms"}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                          <div>
                            <div className="font-medium">P75</div>
                            <div>{formatValue(metric, data.p75)}</div>
                          </div>
                          <div>
                            <div className="font-medium">Min</div>
                            <div>{formatValue(metric, data.min)}</div>
                          </div>
                          <div>
                            <div className="font-medium">Max</div>
                            <div>{formatValue(metric, data.max)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total sessions / page views */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-black">Overview</h3>
                  <p className="text-sm text-gray-500">
                    Total sessions and page performance
                  </p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-500 mb-1">
                        Total Sessions
                      </div>
                      <div className="text-2xl font-bold text-black">
                        {filteredData
                          .filter((d) => d.name === "page_view")
                          .length.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-500 mb-1">
                        Unique Pages
                      </div>
                      <div className="text-2xl font-bold text-black">
                        {new Set(
                          filteredData.map((d) => d.page)
                        ).size.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-500 mb-1">
                        Measurements
                      </div>
                      <div className="text-2xl font-bold text-black">
                        {filteredData.length.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pages Tab */}
          {activeTab === "pages" && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Page Performance</h3>
                  <p className="text-sm text-gray-500">
                    Core Web Vitals metrics by page (top{" "}
                    {pagePerformance.length} pages)
                  </p>
                </div>
                <div className="p-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[300px]"
                        >
                          Page
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Views
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          LCP
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          CLS
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          FID/INP
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pagePerformance.map((page) => (
                        <tr key={page.path}>
                          <td
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-[300px]"
                            title={page.path}
                          >
                            {page.path}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {page.viewCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            {page.metrics.LCP ? (
                              <span
                                style={{
                                  color: getMetricStatus(
                                    "LCP",
                                    page.metrics.LCP
                                  ).color,
                                }}
                              >
                                {Math.round(page.metrics.LCP)}ms
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            {page.metrics.CLS ? (
                              <span
                                style={{
                                  color: getMetricStatus(
                                    "CLS",
                                    page.metrics.CLS
                                  ).color,
                                }}
                              >
                                {page.metrics.CLS.toFixed(3)}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            {page.metrics.INP ? (
                              <span
                                style={{
                                  color: getMetricStatus(
                                    "INP",
                                    page.metrics.INP
                                  ).color,
                                }}
                              >
                                {Math.round(page.metrics.INP)}ms
                              </span>
                            ) : page.metrics.FID ? (
                              <span
                                style={{
                                  color: getMetricStatus(
                                    "FID",
                                    page.metrics.FID
                                  ).color,
                                }}
                              >
                                {Math.round(page.metrics.FID)}ms
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === "trends" && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <h3 className="text-lg font-medium text-black">
                        Metric Trends
                      </h3>
                      <p className="text-sm text-gray-500">
                        Performance trend over time
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <select
                        id="metricSelector"
                        name="metric"
                        className="bg-white text-black rounded-md border border-gray-300 shadow-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value)}
                      >
                        <option value="LCP">LCP</option>
                        <option value="CLS">CLS</option>
                        <option value="FID">FID</option>
                        <option value="INP">INP</option>
                        <option value="TTFB">TTFB</option>
                        <option value="FCP">FCP</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="h-[300px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={timeSeriesData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) =>
                            format(new Date(date), "MM/dd")
                          }
                        />
                        <YAxis
                          tickFormatter={(value) =>
                            selectedMetric === "CLS" ? value.toFixed(2) : value
                          }
                        />
                        <Tooltip
                          formatter={(value) => [
                            selectedMetric === "CLS"
                              ? value.toFixed(3)
                              : Math.round(value) + "ms",
                            selectedMetric,
                          ]}
                          labelFormatter={(date) =>
                            format(new Date(date), "MMM dd, yyyy")
                          }
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          name={selectedMetric}
                          stroke="#A855F7"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="text-sm text-gray-500 mt-4 p-4 bg-gray-50 rounded-lg">
                    <p>
                      {metricDescriptions[selectedMetric] ||
                        "Select a metric to see its description."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Devices Tab */}
          {activeTab === "devices" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-black">
                    Browser Distribution
                  </h3>
                  <p className="text-sm text-gray-500">
                    Sessions by browser type
                  </p>
                </div>
                <div className="p-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceStats.browsers}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {deviceStats.browsers.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                [
                                  "#A855F7", // Purple
                                  "#10B981", // Green
                                  "#F59E0B", // Amber
                                  "#EC4899", // Pink
                                  "#6366F1", // Indigo
                                ][index % 5]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => [
                            `${value} sessions`,
                            props.payload.name,
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-black">
                    Device Types
                  </h3>
                  <p className="text-sm text-gray-500">
                    Sessions by device type
                  </p>
                </div>
                <div className="p-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceStats.devices}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {deviceStats.devices.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                [
                                  "#10B981", // Green for desktop
                                  "#F59E0B", // Amber for tablet
                                  "#6366F1", // Indigo for mobile
                                ][index % 3]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => [
                            `${value} sessions`,
                            props.payload.name,
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="text-xs text-gray-500 mt-10 text-center">
        <p>
          Performance metrics collected via Web Vitals API. Threshold values
          based on Google's Core Web Vitals recommendations.
        </p>
      </div>
    </div>
  );
}
