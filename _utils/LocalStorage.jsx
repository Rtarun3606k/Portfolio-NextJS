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
  console.log("Data stored in localStorage with 30-minute expiration:", data);
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
    return null;
  }

  // Parse the item
  const item = JSON.parse(itemStr);

  // Check if the item has expired
  if (Date.now() > item.expiry) {
    // If expired, remove the item from localStorage and return null
    localStorage.removeItem(dataName);
    console.log("Data expired and removed from localStorage:", dataName);
    return null;
  }
  if (item === undefined) {
    console.log("Data is undefined:", dataName);
    return null;
  }

  // If not expired, return the value
  return item.value;
};
