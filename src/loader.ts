import { buildEntryPath, discoverEntries } from "./discovery.js"
import { parseEntry } from "./parser.js"
import type {
  ContentEntry,
  ContentType,
  ContentTypeMap,
  SiteConfig,
} from "./schema.js"
import { parseSiteConfig } from "./site-config.js"
import { sortByDateDesc } from "./sorting.js"

export interface ContentLoaderOptions {
  contentDir: string
}

export interface ContentLoader {
  getEntries<T extends ContentType>(type: T): Promise<ContentEntry<T>[]>
  getEntry<T extends ContentType>(
    type: T,
    slug: string,
  ): Promise<ContentEntry<T> | null>
  getAllTags(): Promise<string[]>
  getEntriesByTag<T extends ContentType>(
    type: T,
    tag: string,
  ): Promise<ContentEntry<T>[]>
  getSlugs(type: ContentType): Promise<string[]>
  getSiteConfig(): Promise<SiteConfig>
}

const CONTENT_TYPES: ContentType[] = [
  "blog",
  "linkedin",
  "projects",
  "til",
  "snippets",
  "thoughts",
  "quotes",
  "ideas",
]

export function createContentLoader(
  options: ContentLoaderOptions,
): ContentLoader {
  const { contentDir } = options

  async function getEntries<T extends ContentType>(
    type: T,
  ): Promise<ContentEntry<T>[]> {
    const discovered = await discoverEntries(contentDir, type)

    const parsed = await Promise.all(
      discovered.map((file) => parseEntry<T>(file.filePath, type, file.slug)),
    )

    const entries = parsed.filter(
      (entry): entry is ContentEntry<T> => entry !== null,
    )

    return sortByDateDesc(entries)
  }

  async function getEntry<T extends ContentType>(
    type: T,
    slug: string,
  ): Promise<ContentEntry<T> | null> {
    const filePath = buildEntryPath(contentDir, type, slug)
    return parseEntry<T>(filePath, type, slug)
  }

  async function getAllTags(): Promise<string[]> {
    const allTags = new Set<string>()

    for (const type of CONTENT_TYPES) {
      const entries = await getEntries(type)
      for (const entry of entries) {
        for (const tag of entry.frontmatter.tags) {
          allTags.add(tag)
        }
      }
    }

    return [...allTags].sort()
  }

  async function getEntriesByTag<T extends ContentType>(
    type: T,
    tag: string,
  ): Promise<ContentEntry<T>[]> {
    const entries = await getEntries(type)
    return entries.filter((entry) => entry.frontmatter.tags.includes(tag))
  }

  async function getSlugs(type: ContentType): Promise<string[]> {
    const discovered = await discoverEntries(contentDir, type)
    return discovered.map((file) => file.slug)
  }

  async function getSiteConfig(): Promise<SiteConfig> {
    return parseSiteConfig(contentDir)
  }

  return {
    getEntries,
    getEntry,
    getAllTags,
    getEntriesByTag,
    getSlugs,
    getSiteConfig,
  }
}
