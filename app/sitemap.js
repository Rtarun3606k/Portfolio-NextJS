// app/sitemap.js
// import { connectToDatabase } from "@/_utils/Mongodb";
import { getDatabases } from "@/_utils/Mongodb";
import { slugify } from "@/_utils/slugify";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tarunnayaka.me";

  // Define static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/About`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/Projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/Blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/Events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/Contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Fetch all blogs from the database
  let blogRoutes = [];
  try {
    const { blogsCollection } = await getDatabases();

    const blogs = await blogsCollection.find().toArray();
    console.log("Blogs:", blogs);

    blogRoutes = blogs.map((blog) => {
      // Create slug from title using the slugify utility
      const slug = slugify(blog.title);

      return {
        url: `${baseUrl}/Blog/${blog._id}/${slug}`,
        lastModified: blog.updatedAt || blog.createdAt || new Date(),
        changeFrequency: "monthly",
        priority: 0.9,
      };
    });
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
  }

  // Fetch all events from the database
  let eventRoutes = [];
  try {
    const { eventsCollection } = await getDatabases();

    const events = await eventsCollection.find().toArray();
    eventRoutes = events.map((event) => {
      // Create slug from name using the slugify utility
      const slug = slugify(event.name);

      return {
        url: `${baseUrl}/Events/${event._id}/${slug}`,
        lastModified: event.updatedAt || event.createdAt || new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });
  } catch (error) {
    console.error("Error fetching events for sitemap:", error);
  }

  // Fetch all projects from the database
  let projectRoutes = [];
  try {
    const { projectsCollection } = await getDatabases();

    const projects = await projectsCollection.find().toArray();

    projectRoutes = projects.map((project) => {
      // Create slug from title using the slugify utility
      const slug = slugify(project.title);

      return {
        url: `${baseUrl}/Projects/${project._id}/${slug}`,
        lastModified: project.updatedAt || project.createdAt || new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      };
    });
  } catch (error) {
    console.error("Error fetching projects for sitemap:", error);
  }

  // Combine all routes
  return [...staticRoutes, ...blogRoutes, ...eventRoutes, ...projectRoutes];
}
