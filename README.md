# Tarun Nayaka R — Developer Portfolio

> **Professional Portfolio & Content Management System**
>
> Built with Next.js 15, MongoDB, Azure Cloud, and Modern Web Technologies

## Table of Contents

- [System Overview](#system-overview)
- [Architecture](#architecture)
- [Database Structure](#database-structure)
- [Project Setup](#project-setup)
- [Authentication & Authorization](#authentication--authorization)
- [Content Management](#content-management)
- [File Storage](#file-storage)
- [SEO Implementation](#seo-implementation)
- [Deployment](#deployment)
- [Maintenance Tasks](#maintenance-tasks)

## System Overview

This project is a full-featured portfolio website and content management system designed to showcase the professional work, skills, blogs, events, and services of Tarun Nayaka R — a Fullstack Developer, Cloud Architect, and DevOps Engineer specializing in React, Next.js, TypeScript, Python, and cloud technologies.

### Key Features

- **Professional Portfolio Showcase**: Projects, services, and skills presentation
- **Blog Publishing Platform**: Markdown content creation with image uploads
- **Event Management**: Tech events and speaking engagements
- **Service Offerings**: Professional services with pricing and details
- **Dashboard Interface**: Admin panel for content management
- **SEO Optimization**: Dynamic metadata, JSON-LD, and sitemap generation
- **Responsive Design**: Mobile-first approach with modern UI
- **Cloud Integration**: Azure Blob Storage for media assets

## Architecture

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB (multi-database approach)
- **Authentication**: Next Auth with custom JWT implementation
- **File Storage**: Azure Blob Storage
- **Styling**: TailwindCSS, custom animations
- **Deployment**: Azure App Service

### Project Structure

The project follows Next.js 15's App Router structure with route groups:

```
app/
├── (dashboard)/     # Private admin dashboard routes
│   └── dashboard/   # Content management interfaces
├── (root)/          # Public-facing routes
│   └── (views)/     # Main content sections
├── api/             # Backend API endpoints
│   ├── blogs/       # Blog CRUD operations
│   ├── events/      # Event management
│   ├── projects/    # Project management
│   ├── services/    # Services management
│   ├── Components/  # Shared API utilities
│   └── upload/      # File upload handler
├── auth.jsx         # Authentication configuration
├── layout.js        # Root layout with global metadata
├── sitemap.js       # Dynamic sitemap generation
└── robots.js        # SEO robots configuration
```

### Component Organization

The main reusable components are stored in a separate `/components` folder:

```
components/
├── BlogsAndPosts.jsx      # Blog listing component
├── ClientPageTransition.jsx # Page transition animations
├── Footer.jsx             # Site footer
├── MarkDown.jsx           # Markdown editor component
├── Navbar.jsx             # Navigation header
├── Projects.jsx           # Project showcase component
├── Services.jsx           # Services display component
└── Statistics.jsx         # Stats visualization
```

### Utilities and Helpers

Common utility functions and configurations:

```
_utils/
├── auth.js         # Authentication utilities
├── DataFetching.jsx # Data fetching helpers
├── LocalStorage.jsx # Client-side storage utilities
├── Mongodb.jsx     # Database connection management
├── slugify.js      # URL slug generation
└── Variables.jsx   # Shared constants and data
```

## Database Structure

The application uses a multi-database approach in MongoDB for clean separation of concerns:

### Databases and Collections

1. **users**: User authentication and profile information

   - `users`: User accounts with role-based permissions

2. **services**: Professional services offered

   - `services`: Services with pricing, descriptions, and categories

3. **stats**: Performance statistics and metrics

   - `stats`: Achievement metrics and statistics

4. **projects**: Portfolio projects

   - `projects`: Showcase of professional work

5. **blogs**: Blog content management

   - `blogs`: Blog posts with content and metadata

6. **events**: Event management

   - `events`: Tech events, speaking engagements

7. **linkedin**: LinkedIn content integration

   - `linkedin`: LinkedIn posts and professional updates

8. **contact**: Contact form submissions
   - `contact`: Client inquiries and messages

### MongoDB Connection Management

The database connection is managed through a custom factory function that provides access to all collections:

```javascript
// _utils/Mongodb.jsx
export async function getDatabases() {
  const client = await clientPromise;

  const UserDB = client.db("users");
  const Services = client.db("services");
  const Stats = client.db("stats");
  const Projects = client.db("projects");
  const Blogs = client.db("blogs");
  const Events = client.db("events");
  const Linkedin = client.db("linkedin");
  const Contact = client.db("contact");

  return {
    UserDB,
    Services,
    Stats,
    Projects,
    userCollection: UserDB.collection("users"),
    servicesCollection: Services.collection("services"),
    statsCollection: Stats.collection("stats"),
    projectsCollection: Projects.collection("projects"),
    blogsCollection: Blogs.collection("blogs"),
    eventsCollection: Events.collection("events"),
    linkedinCollection: Linkedin.collection("linkedin"),
    contactCollection: Contact.collection("contact"),
  };
}
```

## Project Setup

### Environment Variables

Create a `.env.local` file with the following configuration:

```
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# Authentication
NEXTAUTH_SECRET=your_strong_secret_key
NEXTAUTH_URL=http://localhost:3000

# Azure Storage for Media
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
AZURE_STORAGE_ACCOUNT_NAME=your_storage_account_name
AZURE_STORAGE_ACCOUNT_KEY=your_storage_account_key
AZURE_CDN_ENDPOINT=https://your-cdn-endpoint.azureedge.net (optional)

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000 (development)
NEXT_PUBLIC_BASE_URL=https://tarunnayaka.me (production)
```

### Installation and Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Start production server:
   ```bash
   npm start
   ```

## Authentication & Authorization

The application uses NextAuth.js with JWT for authentication, extended with custom role-based authorization:

### Authentication Flow

1. User logs in through the login form
2. Credentials are validated against the MongoDB users collection
3. JWT token is issued with user information and role
4. Protected routes and API endpoints check for valid authentication

### Role-Based Access

The `withAuth` middleware protects API routes with optional role requirements:

```javascript
// Example of a protected route with role requirement
export const DELETE = withAuth(deleteHandler);
export const GET = withAuth(handler, { requiredRole: "admin" });
```

## Content Management

### Dashboard Interface

The admin dashboard (`/dashboard`) provides interfaces for managing:

- **Projects**: Portfolio projects with images, descriptions, and links
- **Services**: Professional services with pricing and categories
- **Blogs**: Blog posts with markdown content and featured images
- **Events**: Tech events and speaking engagements
- **Statistics**: Achievement metrics and statistics
- **LinkedIn**: Professional posts integration

### Content Workflows

1. **Creating Content**: Add new items through dedicated form interfaces
2. **Updating Content**: Edit existing content with pre-populated forms
3. **Deleting Content**: Remove items with confirmation prompts
4. **Publishing**: Content is live immediately upon creation/update

## File Storage

### Azure Blob Storage Integration

The project uses Azure Blob Storage for all media assets with dedicated containers:

- `projects`: Project showcase images
- `blog-images`: Blog featured images and inline content images
- `events`: Event promotional images
- `linkedinevents`: LinkedIn post images

### Upload Implementation

The Azure integration includes best practices:

```javascript
// app/api/Components/Azure.jsx
export async function uploadToAzure(file, fileName, container) {
  try {
    // Connection and container setup
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = container || "projects";
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create container if needed
    await containerClient.createIfNotExists({ access: "blob" });

    // Generate unique blob name
    const uniqueName = `${Date.now()}-${fileName.replace(/[^\w.-]/g, "")}`;
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueName);

    // Upload with metadata and caching
    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: {
        blobContentType: contentType,
        blobCacheControl: "max-age=86400", // 1 day cache
      },
      metadata: {
        filename: fileName,
        uploadDate: new Date().toISOString(),
      },
    });

    return {
      success: true,
      url: blockBlobClient.url,
      name: uniqueName,
    };
  } catch (error) {
    console.error("Azure upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
```

## SEO Implementation

The project implements comprehensive SEO features:

### Dynamic Metadata

Each page generates appropriate metadata using Next.js 15's metadata API:

```javascript
// Example from app/(root)/(views)/Blog/[...id]/generate.jsx
export async function generateMetadata({ params }) {
  // Fetch blog data
  const blog = await fetchBlog(blogId);

  // Generate metadata including JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    author: {
      "@type": "Person",
      name: blog.author,
    },
    // Additional properties...
  };

  return {
    title: blog.title,
    description: paddedDescription,
    openGraph: {
      // OpenGraph properties...
    },
    twitter: {
      // Twitter card properties...
    },
    other: {
      "application/ld+json": JSON.stringify(jsonLd),
    },
  };
}
```

### Dynamic Sitemap

The project generates a dynamic sitemap that updates when content changes:

```javascript
// app/sitemap.js
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://tarunnayaka.me";

  // Define static routes
  const staticRoutes = [
    // Static routes configuration...
  ];

  // Fetch dynamic content for sitemap
  let blogRoutes = [];
  let eventRoutes = [];
  let projectRoutes = [];

  // Database queries to build complete sitemap
  // ...

  // Combine all routes
  return [...staticRoutes, ...blogRoutes, ...eventRoutes, ...projectRoutes];
}
```

### Revalidation Strategy

To keep the sitemap fresh with new content, a redeploy approach is used:

- The sitemap is regenerated during each deployment
- When adding new content that needs immediate indexing, trigger a new deployment
- For Azure App Service, this ensures all new content is reflected in the sitemap

## Deployment

The application is deployed on Azure App Service:

### Azure App Service Configuration

1. **Runtime Stack**: Node.js 18.x
2. **Build Configuration**:
   - Build Command: `npm run build`
   - Output Directory: `build`
3. **Environment Variables**: Configure as listed in the Project Setup section

### Deployment Process

1. Connect your GitHub repository to Azure App Service
2. Configure CI/CD pipeline for automatic deployments
3. Set up production environment variables
4. Deploy the application

### Custom Domain and SSL

1. Add your custom domain in Azure App Service
2. Enable managed SSL certificate
3. Configure DNS records with your domain provider

## Maintenance Tasks

### Regular Maintenance

- **Database Backups**: Schedule regular MongoDB Atlas backups
- **Content Audits**: Review and update outdated content
- **Image Optimization**: Compress and optimize uploaded images

### SEO Updates

- **Redeploy for Sitemap Updates**: After adding significant content, trigger a redeploy to update the sitemap
- **Metadata Audits**: Periodically review and optimize metadata

### Monitoring

- **Error Tracking**: Review logs in Azure App Service for any errors
- **Performance Metrics**: Monitor page load times and optimize as needed

## Brand Identity

The portfolio site features a distinctive visual identity:

- **Color Scheme**: Purple gradient (#5E60CE to #7209B7) with clean white backgrounds
- **Typography**: Modern, clean fonts with Geist Sans for body text and Space Grotesk for headings
- **Animations**: Subtle motion with Framer Motion for enhanced user experience
- **Visual Style**: Minimalist design with focused content presentation

---

## Contribution

This project is maintained by Tarun Nayaka R. For questions or support, contact through the portfolio site's contact form.

## License

All rights reserved. This codebase is not open source and requires permission for any use beyond viewing.
