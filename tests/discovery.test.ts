import path from "node:path"
import { describe, expect, it } from "vitest"

import { buildEntryPath, discoverEntries } from "../src/discovery.js"

const FIXTURES = path.join(import.meta.dirname, "fixtures")

describe("discoverEntries", () => {
  it("discovers all blog entries", async () => {
    const entries = await discoverEntries(FIXTURES, "blog")
    const slugs = entries.map((e) => e.slug).sort()

    expect(slugs).toEqual(["draft-post", "hello-world", "older-post"])
  })

  it("sets correct type on discovered files", async () => {
    const entries = await discoverEntries(FIXTURES, "blog")

    for (const entry of entries) {
      expect(entry.type).toBe("blog")
    }
  })

  it("builds correct file paths", async () => {
    const entries = await discoverEntries(FIXTURES, "blog")
    const helloWorld = entries.find((e) => e.slug === "hello-world")

    expect(helloWorld?.filePath).toBe(
      path.join(FIXTURES, "blog", "hello-world", "index.md"),
    )
  })

  it("returns empty array for non-existent type", async () => {
    const entries = await discoverEntries(FIXTURES, "linkedin")

    expect(entries).toEqual([])
  })

  it("discovers til entries", async () => {
    const entries = await discoverEntries(FIXTURES, "til")

    expect(entries).toHaveLength(1)
    expect(entries[0].slug).toBe("git-bisect-trick")
  })
})

describe("buildEntryPath", () => {
  it("builds the correct path", () => {
    const result = buildEntryPath("/content", "blog", "my-post")

    expect(result).toBe(path.join("/content", "blog", "my-post", "index.md"))
  })
})
