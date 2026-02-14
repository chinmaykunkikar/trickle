import type { ContentEntry, ContentType } from "./schema.js"

export function sortByDateDesc<T extends ContentType>(
  entries: ContentEntry<T>[],
): ContentEntry<T>[] {
  return [...entries].sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime()
    const dateB = new Date(b.frontmatter.date).getTime()
    return dateB - dateA
  })
}
