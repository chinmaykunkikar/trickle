// src/discovery.ts
import { glob } from "glob";
import path from "path";
async function discoverEntries(contentDir, type) {
  const pattern = `${type}/*/index.md`;
  const matches = await glob(pattern, { cwd: contentDir });
  return matches.map((match) => {
    const parts = match.split("/");
    return {
      filePath: path.join(contentDir, match),
      slug: parts[1],
      type
    };
  });
}
function buildEntryPath(contentDir, type, slug) {
  return path.join(contentDir, type, slug, "index.md");
}

// src/parser.ts
import matter from "gray-matter";
import fs from "fs/promises";
async function parseEntry(filePath, type, slug) {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(raw);
    if (data.date instanceof Date) {
      data.date = data.date.toISOString().split("T")[0];
    }
    const frontmatter = data;
    if (frontmatter.draft) {
      return null;
    }
    return {
      slug,
      type,
      frontmatter,
      content
    };
  } catch {
    return null;
  }
}

// src/site-config.ts
import matter2 from "gray-matter";
import fs2 from "fs/promises";
import path2 from "path";
async function parseSiteConfig(contentDir) {
  const filePath = path2.join(contentDir, "site.yaml");
  const raw = await fs2.readFile(filePath, "utf-8");
  const wrapped = `---
${raw}
---`;
  const { data } = matter2(wrapped);
  return data;
}

// src/sorting.ts
function sortByDateDesc(entries) {
  return [...entries].sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA;
  });
}

// src/loader.ts
var CONTENT_TYPES = [
  "blog",
  "linkedin",
  "projects",
  "til",
  "snippets",
  "thoughts",
  "quotes",
  "ideas"
];
function createContentLoader(options) {
  const { contentDir } = options;
  async function getEntries(type) {
    const discovered = await discoverEntries(contentDir, type);
    const parsed = await Promise.all(
      discovered.map((file) => parseEntry(file.filePath, type, file.slug))
    );
    const entries = parsed.filter(
      (entry) => entry !== null
    );
    return sortByDateDesc(entries);
  }
  async function getEntry(type, slug) {
    const filePath = buildEntryPath(contentDir, type, slug);
    return parseEntry(filePath, type, slug);
  }
  async function getAllTags() {
    const allTags = /* @__PURE__ */ new Set();
    for (const type of CONTENT_TYPES) {
      const entries = await getEntries(type);
      for (const entry of entries) {
        for (const tag of entry.frontmatter.tags) {
          allTags.add(tag);
        }
      }
    }
    return [...allTags].sort();
  }
  async function getEntriesByTag(type, tag) {
    const entries = await getEntries(type);
    return entries.filter((entry) => entry.frontmatter.tags.includes(tag));
  }
  async function getSlugs(type) {
    const discovered = await discoverEntries(contentDir, type);
    return discovered.map((file) => file.slug);
  }
  async function getSiteConfig() {
    return parseSiteConfig(contentDir);
  }
  return {
    getEntries,
    getEntry,
    getAllTags,
    getEntriesByTag,
    getSlugs,
    getSiteConfig
  };
}
export {
  createContentLoader
};
//# sourceMappingURL=index.js.map