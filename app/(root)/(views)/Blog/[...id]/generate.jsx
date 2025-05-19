// Metadata generation for enhanced SEO
import { slugify } from "@/_utils/slugify";

/**
 * Generate metadata for the blog page
 * This function is called by Next.js to generate metadata for the page
 * which improves SEO by providing rich metadata to search engines
 */
export async function generateMetadata({ params }) {
  // With NextJS 15+, params should be awaited
  const resolvedParams = await params;
  const blogId = Array.isArray(resolvedParams.id)
    ? resolvedParams.id[0]
    : resolvedParams.id;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blogId}`,
    {
      next: { revalidate: 60 }, // optional caching
    }
  );

  if (!res.ok) {
    return { title: "Blog Not Found" };
  }

  const blog = await res.json();
  const plainText = blog.content
    .replace(/[#_*`~>\-\[\]\(\)!\n]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  const paddedDescription = plainText.padEnd(100, " ");

  // Create JSON-LD structured data for this blog post
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: paddedDescription,
    image:
      blog.featuredImage || `${process.env.NEXT_PUBLIC_BASE_URL}/image.png`,
    datePublished: blog.createdAt || new Date().toISOString(),
    dateModified: blog.updatedAt || blog.createdAt || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: blog.author?.name || "Tarun Nayaka R",
      url: process.env.NEXT_PUBLIC_BASE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Tarun Nayaka R",
      url: process.env.NEXT_PUBLIC_BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/image.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/Blog/${blogId}/${slugify(
        blog.title
      )}`,
    },
  };

  return {
    title: blog.title,
    description: paddedDescription,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "https://tarunnayakar.com"
    ),
    openGraph: {
      title: blog.title,
      description: paddedDescription,
      url: `/Blog/${blogId}/${slugify(blog.title)}`,
      siteName: "Tarun Nayaka R",
      locale: "en_US",
      type: "article",
      publishedTime: blog.createdAt || new Date().toISOString(),
      authors: [blog.author || "Tarun Nayaka R"],
      images: [
        {
          url: blog.featuredImage || "/image.png",
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: paddedDescription,
      images: [
        blog.featuredImage || "https://placehold.co/600x400?text=No+Image",
      ],
    },
    other: {
      "application/ld+json": JSON.stringify(jsonLd),
    },
  };
}
