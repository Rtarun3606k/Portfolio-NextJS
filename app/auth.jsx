// This file previously set up NextAuth authentication
// Now it provides mock authentication functions for compatibility

// Public user that will be used for all requests
const publicUser = {
  id: "public-user",
  name: "Public User",
  email: "public@example.com",
  role: "admin", // Give admin role to access all features
  image:
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
};

// Mock auth function that always returns the public user
export const auth = async () => {
  return {
    user: publicUser,
  };
};

// Mock handlers for compatibility
export const handlers = {
  GET: async () => new Response(JSON.stringify({ user: publicUser })),
  POST: async () => new Response(JSON.stringify({ user: publicUser })),
};

// Mock sign in function
export const signIn = async () => {
  return { success: true, user: publicUser };
};

// Mock sign out function
export const signOut = async () => {
  return { success: true };
};
