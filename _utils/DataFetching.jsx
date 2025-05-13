// utils/serverFetch.js
export const ParallelFetch = async (tasks) => {
  const results = await Promise.all(
    tasks.map(async ({ url, options = {}, retries = 3, delay = 1000 }) => {
      let attempt = 0;
      while (attempt < retries) {
        try {
          const res = await fetch(url, options);
          if (!res.ok) throw new Error(`Status ${res.status}`);
          return await res.json();
        } catch (error) {
          attempt++;
          if (attempt >= retries) return { error: error.message };
          await new Promise((res) => setTimeout(res, delay));
        }
      }
    })
  );

  return results;
};

export const EventIDFetch = async (id) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`
  );

  if (!response.ok) {
    console.log("Error fetching event data:", response);
    throw new Error("Failed to fetch event data");
  }

  const data = await response.json();
  return data;
};
