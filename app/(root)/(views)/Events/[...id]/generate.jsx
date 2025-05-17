import { slugify } from "@/_utils/slugify";

export async function generateMetadata({ params }) {
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${eventId}`,
    {
      next: { revalidate: 60 }, // optional caching
    }
  );

  if (!res.ok) {
    return { title: "Event Not Found" };
  }

  const data = await res.json();
  const event = data.event;

  // Extract plain text description for meta tags
  const plainText = event.description
    ? event.description
        .replace(/[#_*`~>\-\[\]\(\)!\n]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 160)
    : "Learn more about this event hosted by " + event.host;

  return {
    title: event.name,
    description: plainText,
    openGraph: {
      title: event.name,
      description: plainText,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/Events/${eventId}/${slugify(
        event.name
      )}`,
      images: [
        {
          url: event.image || "https://placehold.co/600x400?text=No+Image",
          width: 1200,
          height: 630,
          alt: event.name,
        },
      ],
      type: "article",
      siteName: "Tarun Nayaka R",
    },
    twitter: {
      card: "summary_large_image",
      title: event.name,
      description: plainText,
      images: [event.image || "https://placehold.co/600x400?text=No+Image"],
      creator: "@tarunnayakar",
    },
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/Events/${eventId}/${slugify(event.name)}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
