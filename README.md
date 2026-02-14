# trickle

Typed content loader for git-backed markdown CMS. Parses YAML frontmatter with [gray-matter](https://github.com/jonschlinkert/gray-matter), filters drafts, sorts by date, and gives you a clean API to query content entries.

## Install

```bash
npm install github:chinmaykunkikar/trickle
```

## Usage

```typescript
import { createContentLoader } from "@chinmay/trickle"

const content = createContentLoader({ contentDir: "./content" })

// Get all published blog posts, sorted by date (newest first)
const posts = await content.getEntries("blog")

// Get a single entry by slug
const post = await content.getEntry("blog", "my-post")

// Get all tags across every content type
const tags = await content.getAllTags()

// Filter entries by tag
const reactPosts = await content.getEntriesByTag("blog", "react")

// Get all slugs (useful for static path generation)
const slugs = await content.getSlugs("blog")
```

All methods are fully typed — `getEntries("blog")` returns `ContentEntry<"blog">[]` with `BlogFrontmatter`, `getEntries("projects")` returns `ProjectFrontmatter`, etc.

## Content directory structure

trickle expects content organized as:

```
content/
├── blog/<slug>/index.md
├── linkedin/<slug>/index.md
├── projects/<slug>/index.md
├── til/<slug>/index.md
├── snippets/<slug>/index.md
├── thoughts/<slug>/index.md
├── quotes/<slug>/index.md
└── ideas/<slug>/index.md
```

Each `index.md` starts with YAML frontmatter:

```yaml
---
title: Hello World
date: 2025-01-15
tags:
  - intro
  - meta
draft: false
description: My first blog post.
---

Markdown body here.
```

## API

### `createContentLoader(options)`

Creates a content loader instance.

| Option | Type | Description |
|---|---|---|
| `contentDir` | `string` | Path to the content directory |

### Methods

| Method | Returns | Description |
|---|---|---|
| `getEntries(type)` | `ContentEntry<T>[]` | All published entries, sorted by date desc |
| `getEntry(type, slug)` | `ContentEntry<T> \| null` | Single entry by slug, or null |
| `getAllTags()` | `string[]` | Deduplicated, sorted tags across all types |
| `getEntriesByTag(type, tag)` | `ContentEntry<T>[]` | Entries matching a tag |
| `getSlugs(type)` | `string[]` | All slugs (including drafts) |

### Hardcoded behaviors

- Entries with `draft: true` are always excluded (except `getSlugs`)
- Entries are always sorted by date descending

## MDX

trickle returns raw markdown in the `content` field. MDX compilation is left to the consumer:

```tsx
import { MDXRemote } from "next-mdx-remote/rsc"

const post = await content.getEntry("blog", params.slug)
<MDXRemote source={post.content} components={{ Callout, CodeBlock }} />
```

## Content types

| Type | Extra frontmatter |
|---|---|
| `blog` | `description` |
| `linkedin` | `linkedinUrl` |
| `projects` | `description`, `techStack`, `liveUrl`, `sourceUrl`, `featured`, `category` |
| `til` | — |
| `snippets` | `description`, `language` |
| `thoughts` | — |
| `quotes` | `attribution`, `source` |
| `ideas` | `status` |

## Development

```bash
npm install
npm run build    # ESM + CJS + .d.ts via tsup
npm test         # vitest
```

## License

MIT
