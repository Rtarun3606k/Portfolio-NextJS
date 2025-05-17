import EventContent from "./EventContent";
import { generateMetadata } from "./generate";

// Export the generateMetadata function to be used by Next.js
export { generateMetadata };

const page = () => {
  return <EventContent />;
};

export default page;
