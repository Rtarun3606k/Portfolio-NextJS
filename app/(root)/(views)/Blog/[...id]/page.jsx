import PageBlog from "./BlogContent";
import { generateMetadata } from "./generate";

// Export the generateMetadata function to be used by Next.js
export { generateMetadata };

/**
 * Server Component - Blog Page
 * This is a server component that will be SSR'd, which improves SEO.
 * It passes the route params to the PageBlog component for data fetching.
 */
export default function Page({ params }) {
  return <PageBlog params={params} />;
}
