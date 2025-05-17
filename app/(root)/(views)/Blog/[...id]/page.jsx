import PageBlog from "./BlogContent";
import { generateMetadata } from "./generate";

// Export the generateMetadata function to be used by Next.js
export { generateMetadata };

const page = () => {
  return <PageBlog />;
};

export default page;
