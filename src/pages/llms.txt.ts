import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "@config";
import getSortedPosts from "@utils/getSortedPosts";
import { toKnowledgeDocuments } from "@utils/knowledge";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const documents = toKnowledgeDocuments(getSortedPosts(posts));

  const lines = [
    `# ${SITE.title}`,
    "",
    `> ${SITE.desc}`,
    "",
    "这是一个面向 LLM 和 RAG 系统的博客内容索引。每条记录包含文章链接、摘要、标签和主要知识点。",
    "",
    "## Blog Posts",
    "",
    ...documents.map(doc => {
      const headings = doc.headings.length
        ? ` 知识点：${doc.headings.join("、")}。`
        : "";
      return `- [${doc.title}](${doc.url}): ${doc.description} ${doc.summary.replace(/\s+/g, " ")}${headings}`;
    }),
    "",
    "## Machine Readable Index",
    "",
    "- [/knowledge-base.json](/knowledge-base.json): JSON 格式知识库，可用于检索、RAG 或外部索引。",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
