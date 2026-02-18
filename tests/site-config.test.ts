import path from "node:path"
import { describe, expect, it } from "vitest"

import { createContentLoader } from "../src/loader.js"

const FIXTURES = path.join(import.meta.dirname, "fixtures")
const content = createContentLoader({ contentDir: FIXTURES })

describe("getSiteConfig", () => {
  it("returns parsed site config", async () => {
    const config = await content.getSiteConfig()

    expect(config.personal.name).toBe("Test User")
    expect(config.personal.title).toBe("Software Engineer")
    expect(config.personal.available).toBe(true)
    expect(config.personal.email).toBe("hello@test.dev")
  })

  it("returns badges array", async () => {
    const config = await content.getSiteConfig()

    expect(config.badges).toHaveLength(2)
    expect(config.badges[0]).toContain("3+ Years")
  })

  it("returns experience entries", async () => {
    const config = await content.getSiteConfig()

    expect(config.experience).toHaveLength(1)
    expect(config.experience[0].company).toBe("Acme Corp")
    expect(config.experience[0].role).toBe("Software Engineer")
  })

  it("returns code comments", async () => {
    const config = await content.getSiteConfig()

    expect(config.code_comments).toHaveLength(2)
    expect(config.code_comments).toContain("mass × acceleration")
  })
})
