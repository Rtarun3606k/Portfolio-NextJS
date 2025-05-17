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

  const event = await res.json();
  const plainText = event.description
    .replace(/[#_*`~>\-\[\]\(\)!\n]/g, " ")
    .slice(0, 160);

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
    },
    twitter: {
      card: "summary_large_image",
      title: event.name,
      description: plainText,
      images: [event.image],
    },
  };
}
