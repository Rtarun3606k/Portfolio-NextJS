// app/Blog/[...id]/generate.js
import { slugify } from "@/_utils/slugify";

export async function generateMetadata({ params }) {
  const blogId = Array.isArray(params.id) ? params.id[0] : params.id;

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

  return {
    title: blog.title,
    description: paddedDescription,
    openGraph: {
      title: blog.title,
      description: paddedDescription,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/Blog/${blogId}/${slugify(
        blog.title
      )}`,
      images: [
        {
          url:
            blog.featuredImage || "https://placehold.co/600x400?text=No+Image",
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
  };
}
