import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import type { KnowledgeDocument } from "@utils/knowledge";

type Props = {
  documents: KnowledgeDocument[];
};

const KnowledgeExplorer = ({ documents }: Props) => {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(documents, {
        keys: [
          { name: "title", weight: 0.35 },
          { name: "description", weight: 0.25 },
          { name: "summary", weight: 0.2 },
          { name: "tags", weight: 0.15 },
          { name: "text", weight: 0.05 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [documents]
  );

  const results = query.trim()
    ? fuse.search(query.trim()).map(result => result.item)
    : documents;

  return (
    <section className="mt-8">
      <label className="sr-only" htmlFor="knowledge-query">
        搜索知识库
      </label>
      <input
        id="knowledge-query"
        className="focus-outline w-full rounded border border-skin-line bg-skin-fill px-4 py-3 text-base"
        value={query}
        placeholder="搜索文章、标签、摘要或关键词..."
        onChange={event => setQuery(event.target.value)}
      />

      <div className="mt-4 text-sm opacity-80">
        {query.trim()
          ? `找到 ${results.length} 条相关内容`
          : `共收录 ${documents.length} 篇文章`}
      </div>

      <div className="mt-6 grid gap-5">
        {results.map(doc => (
          <article
            className="rounded border border-skin-line bg-skin-card p-5"
            key={doc.id}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="text-xl font-semibold text-skin-accent">
                <a className="hover:underline" href={doc.url}>
                  {doc.title}
                </a>
              </h2>
              {doc.pubDatetime && (
                <time className="text-sm opacity-70">
                  {new Date(doc.pubDatetime).toLocaleDateString("zh-CN")}
                </time>
              )}
            </div>

            <p className="mt-3 opacity-90">{doc.description}</p>

            <div className="mt-4 rounded border border-skin-line bg-skin-fill p-4">
              <div className="mb-2 text-sm font-semibold">文章总结</div>
              <p className="whitespace-pre-line text-sm leading-7 opacity-90">
                {doc.summary}
              </p>
            </div>

            {doc.headings.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 text-sm font-semibold">知识点</div>
                <ul className="flex flex-wrap gap-2">
                  {doc.headings.map(heading => (
                    <li
                      className="rounded border border-skin-line px-2 py-1 text-xs"
                      key={heading}
                    >
                      {heading}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {doc.tags.map(tag => (
                <span
                  className="rounded bg-skin-accent px-2 py-1 text-xs text-skin-inverted"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default KnowledgeExplorer;
