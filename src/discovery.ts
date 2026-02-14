import { glob } from "glob"
import path from "node:path"

import type { ContentType } from "./schema.js"

export interface DiscoveredFile {
  filePath: string
  slug: string
  type: ContentType
}

export async function discoverEntries(
  contentDir: string,
  type: ContentType,
): Promise<DiscoveredFile[]> {
  const pattern = `${type}/*/index.md`
  const matches = await glob(pattern, { cwd: contentDir })

  return matches.map((match) => {
    const parts = match.split("/")
    return {
      filePath: path.join(contentDir, match),
      slug: parts[1],
      type,
    }
  })
}

export function buildEntryPath(
  contentDir: string,
  type: ContentType,
  slug: string,
): string {
  return path.join(contentDir, type, slug, "index.md")
}
