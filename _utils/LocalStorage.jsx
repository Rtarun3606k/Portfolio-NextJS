// export const Services = localStorage.getItem("data");
/**
 * Stores data in localStorage with a 30-minute expiration time
 * @param {string} dataName - The key to store the data under
 * @param {any} data - The data to store
 */
export const storeData = (dataName, data) => {
  // Create an object that includes the data and the expiration time
  const item = {
    value: data,
    // expiry: Date.now() + 30 * 60 * 1000, // Current time + 30 minutes in milliseconds
    expiry: Date.now() + 10 * 60 * 1000, // Current time + 10 minutes in milliseconds
  };

  // Store the object in localStorage
  localStorage.setItem(dataName, JSON.stringify(item));
  // console.log("Data stored in localStorage with 30-minute expiration:", data);
};

/**
 * Retrieves data from localStorage if it exists and hasn't expired
 * @param {string} dataName - The key to retrieve data for
 * @returns {any|null} - The stored data or null if not found or expired
 */
export const getData = (dataName) => {
  const itemStr = localStorage.getItem(dataName);

  // Return null if no item exists
  if (!itemStr) {
    // console.log(`No data found in localStorage for: ${dataName}`);
    return null;
  }

  try {
    // Parse the item
    const item = JSON.parse(itemStr);

    // Check if the item is properly structured
    if (!item || item.value === undefined) {
      // console.log(`Data is malformed for: ${dataName}`);
      return null;
    }

    // Check if the item has expired
    if (item.expiry && Date.now() > item.expiry) {
      // If expired, remove the item from localStorage and return null
      localStorage.removeItem(dataName);
      // console.log(`Data expired and removed from localStorage: ${dataName}`);
      return null;
    }

    // If not expired and properly structured, return the value
    return item.value;
  } catch (error) {
    console.error(
      `Error parsing data from localStorage for: ${dataName}`,
      error
    );
    localStorage.removeItem(dataName);
    return null;
  }
};

export const SetAdminAccess = (data) => {
  // console.log("Setting admin access in localStorage:", data);
  // Create an object that includes the data and the expiration time
  const item = {
    value: data,
    // expiry: Date.now() + 30 * 60 * 1000, // Current time + 30 minutes in milliseconds
    expiry: Date.now() + 120 * 60 * 1000, // Current time + 10 minutes in milliseconds
  };

  // Store the object in localStorage
  localStorage.setItem("adminAccess", JSON.stringify(item));
  // console.log("Data stored in localStorage with 30-minute expiration:", data);
};

export const GetAdminAccess = () => {
  try {
    // Function to parse cookies from document.cookie
    const parseCookies = () => {
      const cookieObj = {};
      const cookies = document.cookie.split(";");

      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name) cookieObj[name] = decodeURIComponent(value);
      }

      return cookieObj;
    };

    // Get all cookies
    const cookies = parseCookies();

    // Return null if no adminAccess cookie exists
    if (!cookies.adminAccess) {
      // console.log(`No cookie found for: adminAccess`);
      return null;
    }

    // Parse the cookie value
    const item = JSON.parse(cookies.adminAccess);

    // Check if the item is properly structured
    if (!item || item.value === undefined) {
      // console.log(`Cookie data is malformed for: adminAccess`);
      return null;
    }

    // Check if the item has expired
    if (item.expiry && Date.now() > item.expiry) {
      // If expired, remove the cookie and return null
      document.cookie =
        "adminAccess=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // console.log(`Cookie expired and removed: adminAccess`);
      return null;
    }

    // If not expired and properly structured, return the value
    return item.value;
  } catch (error) {
    console.error(`Error parsing cookie data for: adminAccess`, error);
    // Remove potentially corrupted cookie
    document.cookie =
      "adminAccess=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return null;
  }
};
