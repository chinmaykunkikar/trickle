import path from "node:path"
import { describe, expect, it } from "vitest"

import { createContentLoader } from "../src/loader.js"

const FIXTURES = path.join(import.meta.dirname, "fixtures")
const content = createContentLoader({ contentDir: FIXTURES })

describe("getEntries", () => {
  it("returns non-draft entries sorted by date desc", async () => {
    const entries = await content.getEntries("blog")

    expect(entries).toHaveLength(2)
    expect(entries[0].slug).toBe("hello-world")
    expect(entries[1].slug).toBe("older-post")
  })

  it("excludes drafts", async () => {
    const entries = await content.getEntries("blog")
    const slugs = entries.map((e) => e.slug)

    expect(slugs).not.toContain("draft-post")
  })

  it("returns empty array for type with no entries", async () => {
    const entries = await content.getEntries("linkedin")

    expect(entries).toEqual([])
  })
})

describe("getEntry", () => {
  it("returns a single entry by slug", async () => {
    const entry = await content.getEntry("blog", "hello-world")

    expect(entry).not.toBeNull()
    expect(entry!.frontmatter.title).toBe("Hello World")
  })

  it("returns null for non-existent slug", async () => {
    const entry = await content.getEntry("blog", "does-not-exist")

    expect(entry).toBeNull()
  })

  it("returns null for draft entry", async () => {
    const entry = await content.getEntry("blog", "draft-post")

    expect(entry).toBeNull()
  })
})

describe("getAllTags", () => {
  it("returns deduplicated sorted tags across all types", async () => {
    const tags = await content.getAllTags()

    expect(tags).toContain("intro")
    expect(tags).toContain("git")
    expect(tags).toContain("react")
    expect(tags).toEqual([...tags].sort())
  })

  it("does not include tags from draft entries", async () => {
    const tags = await content.getAllTags()

    expect(tags).not.toContain("wip")
  })
})

describe("getEntriesByTag", () => {
  it("filters entries by tag", async () => {
    const entries = await content.getEntriesByTag("blog", "intro")

    expect(entries).toHaveLength(2)
  })

  it("returns empty for non-existent tag", async () => {
    const entries = await content.getEntriesByTag("blog", "nonexistent")

    expect(entries).toEqual([])
  })
})

describe("getSlugs", () => {
  it("returns all slugs including drafts", async () => {
    const slugs = await content.getSlugs("blog")

    expect(slugs.sort()).toEqual(["draft-post", "hello-world", "older-post"])
  })

  it("returns empty for type with no entries", async () => {
    const slugs = await content.getSlugs("linkedin")

    expect(slugs).toEqual([])
  })
})
