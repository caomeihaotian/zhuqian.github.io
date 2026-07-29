import type { CollectionEntry } from "astro:content";
import slugify from "@utils/slugify";

export type KnowledgePost = CollectionEntry<"blog">;

export type KnowledgeDocument = {
  id: string;
  title: string;
  description: string;
  summary: string;
  url: string;
  tags: string[];
  pubDatetime?: string;
  text: string;
  headings: string[];
};

const stripMarkdown = (value = "") =>
  value
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_\-~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const getPostUrl = (post: KnowledgePost) => `/posts/${slugify(post.data)}`;

export const getPostHeadings = (body = "") =>
  Array.from(body.matchAll(/^#{2,3}\s+(.+)$/gm))
    .map(match => stripMarkdown(match[1]))
    .filter(Boolean)
    .slice(0, 8);

export const getPostSummary = (post: KnowledgePost) => {
  if (post.data.summary) return post.data.summary;

  const headings = getPostHeadings(post.body);
  const plainBody = stripMarkdown(post.body);
  const firstSentence =
    plainBody.match(/^(.{24,220}?[。！？.!?])/)?.[1] ??
    plainBody.slice(0, 180);

  const parts = [
    post.data.description,
    headings.length ? `核心内容包括：${headings.slice(0, 3).join("、")}。` : "",
    firstSentence && firstSentence !== post.data.description
      ? `文章开篇关注：${firstSentence}`
      : "",
  ].filter(Boolean);

  return parts.join("\n");
};

export const toKnowledgeDocument = (post: KnowledgePost): KnowledgeDocument => {
  const headings = getPostHeadings(post.body);
  const text = stripMarkdown(post.body);

  return {
    id: post.id,
    title: post.data.title,
    description: post.data.description,
    summary: getPostSummary(post),
    url: getPostUrl(post),
    tags: post.data.tags,
    pubDatetime: post.data.pubDatetime,
    text,
    headings,
  };
};

export const toKnowledgeDocuments = (posts: KnowledgePost[]) =>
  posts.map(toKnowledgeDocument);
