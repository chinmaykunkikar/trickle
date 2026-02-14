"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createContentLoader: () => createContentLoader
});
module.exports = __toCommonJS(index_exports);

// src/discovery.ts
var import_glob = require("glob");
var import_node_path = __toESM(require("path"), 1);
async function discoverEntries(contentDir, type) {
  const pattern = `${type}/*/index.md`;
  const matches = await (0, import_glob.glob)(pattern, { cwd: contentDir });
  return matches.map((match) => {
    const parts = match.split("/");
    return {
      filePath: import_node_path.default.join(contentDir, match),
      slug: parts[1],
      type
    };
  });
}
function buildEntryPath(contentDir, type, slug) {
  return import_node_path.default.join(contentDir, type, slug, "index.md");
}

// src/parser.ts
var import_gray_matter = __toESM(require("gray-matter"), 1);
var import_promises = __toESM(require("fs/promises"), 1);
async function parseEntry(filePath, type, slug) {
  try {
    const raw = await import_promises.default.readFile(filePath, "utf-8");
    const { data, content } = (0, import_gray_matter.default)(raw);
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
  return {
    getEntries,
    getEntry,
    getAllTags,
    getEntriesByTag,
    getSlugs
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createContentLoader
});
//# sourceMappingURL=index.cjs.map