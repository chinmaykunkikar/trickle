import path from "node:path"
import { describe, expect, it } from "vitest"

import { parseEntry } from "../src/parser.js"

const FIXTURES = path.join(import.meta.dirname, "fixtures")

describe("parseEntry", () => {
  it("parses a valid blog entry", async () => {
    const filePath = path.join(FIXTURES, "blog", "hello-world", "index.md")
    const entry = await parseEntry(filePath, "blog", "hello-world")

    expect(entry).not.toBeNull()
    expect(entry!.slug).toBe("hello-world")
    expect(entry!.type).toBe("blog")
    expect(entry!.frontmatter.title).toBe("Hello World")
    expect(entry!.frontmatter.date).toBe("2025-01-15")
    expect(entry!.frontmatter.tags).toEqual(["intro", "meta"])
    expect(entry!.frontmatter.description).toBe(
      "My first blog post about getting started.",
    )
    expect(entry!.content).toContain("body of the hello world post")
  })

  it("returns null for draft entries", async () => {
    const filePath = path.join(FIXTURES, "blog", "draft-post", "index.md")
    const entry = await parseEntry(filePath, "blog", "draft-post")

    expect(entry).toBeNull()
  })

  it("returns null for non-existent file", async () => {
    const filePath = path.join(FIXTURES, "blog", "no-such-post", "index.md")
    const entry = await parseEntry(filePath, "blog", "no-such-post")

    expect(entry).toBeNull()
  })

  it("parses project entry with extra frontmatter", async () => {
    const filePath = path.join(FIXTURES, "projects", "cool-app", "index.md")
    const entry = await parseEntry(filePath, "projects", "cool-app")

    expect(entry).not.toBeNull()
    expect(entry!.frontmatter.techStack).toEqual(["React", "TypeScript"])
    expect(entry!.frontmatter.featured).toBe(true)
    expect(entry!.frontmatter.category).toBe("project")
  })
})
