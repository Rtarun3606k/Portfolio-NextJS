"use server";

/**
 * Updates the view count for a blog post
 * This is a server action that can be called from a client component
 */
export async function updateViews(blogId, currentViews) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/blogs/${blogId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ views: currentViews }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update views");
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating views:", error);
    return { success: false, error: error.message };
  }
}
