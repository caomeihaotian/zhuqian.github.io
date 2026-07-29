# 博客知识库与文章总结

本项目参考 `gastrodia/blog` 的 RAG 知识库和文章总结思路，采用适合 GitHub Pages 静态部署的轻量实现。

## 已实现功能

- `/knowledge`：博客知识库页面，支持按标题、描述、摘要、标签和正文检索。
- `/knowledge-base.json`：机器可读的文章知识库索引，可用于后续 RAG、外部搜索或向量化任务。
- `/llms.txt`：面向 LLM 的博客文章索引，方便 AI 工具快速理解站点内容。
- 文章详情页摘要卡片：每篇文章自动展示“AI 文章总结”。

## 摘要生成规则

当前摘要在构建时静态生成，不依赖 API key：

1. 优先使用文章 frontmatter 中的 `summary` 字段。
2. 如果没有 `summary`，使用 `description`、正文标题和首段内容自动生成。

可选 frontmatter 示例：

```yaml
---
title: 示例文章
description: 这是一篇示例文章
summary: |
  这篇文章介绍了……
  核心内容包括……
---
```

## 与服务端 RAG 的区别

`gastrodia/blog` 使用了 Gemini Embedding、PostgreSQL pgvector 和 Groq API，适合部署在 Vercel、Node Server 或其他支持服务端 API 的平台。

本博客当前是 GitHub Pages 静态站点，因此默认实现为：

- 构建时生成知识库
- 浏览器端本地检索
- 无服务端 API
- 无数据库和密钥依赖

如果未来迁移到 Vercel 或其他服务端环境，可以继续增加：

- `GEMINI_API_KEY`
- `GROQ_API_KEY`
- `POSTGRES_URL`
- `/api/chat`
- 向量索引脚本

## 数据格式

`/knowledge-base.json` 中每篇文章包含：

- `id`
- `title`
- `description`
- `summary`
- `url`
- `tags`
- `pubDatetime`
- `text`
- `headings`

这些字段已经足够用于后续向量化、RAG 检索、文章摘要增强和外部搜索索引。
