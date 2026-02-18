import matter from "gray-matter"
import fs from "node:fs/promises"
import path from "node:path"

import type { SiteConfig } from "./schema.js"

export async function parseSiteConfig(
  contentDir: string,
): Promise<SiteConfig> {
  const filePath = path.join(contentDir, "site.yaml")
  const raw = await fs.readFile(filePath, "utf-8")
  const wrapped = `---\n${raw}\n---`
  const { data } = matter(wrapped)

  return data as SiteConfig
}
