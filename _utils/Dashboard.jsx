"use client";

// Set client-side authentication indicator
// Note: This doesn't provide security, just improves UI experience
export const SetClientAuth = (isAuthenticated) => {
  try {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
    return true;
  } catch (error) {
    console.error("Error setting client auth state:", error);
    return false;
  }
};

// Check client-side authentication indicator
export const GetClientAuth = () => {
  try {
    const authState = localStorage.getItem("isAuthenticated");
    return authState ? JSON.parse(authState) : false;
  } catch (error) {
    console.error("Error getting client auth state:", error);
    return false;
  }
};

// Clear client-side authentication indicator
export const ClearClientAuth = () => {
  try {
    localStorage.removeItem("isAuthenticated");
    return true;
  } catch (error) {
    console.error("Error clearing client auth state:", error);
    return false;
  }
};
