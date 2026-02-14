import matter from "gray-matter"
import fs from "node:fs/promises"

import type { ContentEntry, ContentType, ContentTypeMap } from "./schema.js"

export async function parseEntry<T extends ContentType>(
  filePath: string,
  type: T,
  slug: string,
): Promise<ContentEntry<T> | null> {
  try {
    const raw = await fs.readFile(filePath, "utf-8")
    const { data, content } = matter(raw)

    if (data.date instanceof Date) {
      data.date = data.date.toISOString().split("T")[0]
    }

    const frontmatter = data as ContentTypeMap[T]

    if (frontmatter.draft) {
      return null
    }

    return {
      slug,
      type,
      frontmatter,
      content,
    }
  } catch {
    return null
  }
}
