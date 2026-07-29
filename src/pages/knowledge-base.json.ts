import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import getSortedPosts from "@utils/getSortedPosts";
import { toKnowledgeDocuments } from "@utils/knowledge";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const documents = toKnowledgeDocuments(getSortedPosts(posts));

  return new Response(JSON.stringify({ generatedAt: new Date().toISOString(), documents }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
