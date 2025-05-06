"use client";

import MarkdownEditor from "@/components/MarkDown";
import { useParams } from "next/navigation";

export default function EditorPage() {
  const { id } = useParams();

  return <MarkdownEditor id={id} />;
}
