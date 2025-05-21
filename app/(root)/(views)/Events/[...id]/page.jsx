import EventContent from "./EventContent";
import { generateMetadata } from "./generate";
import NewsletterWrapper from "@/components/NewsletterWrapper";

// Export the generateMetadata function to be used by Next.js
export { generateMetadata };

const page = () => {
  return (
    <>
      <EventContent />
      <NewsletterWrapper />
    </>
  );
};

export default page;
