/**
 * Frontmatter type definitions for the content repository.
 *
 * These types document the YAML frontmatter schema for each content type.
 * Consumer apps can import these directly for type-safe content parsing.
 *
 * Usage with gray-matter:
 *
 *   import matter from "gray-matter"
 *   import type { BlogFrontmatter } from "<content-repo>/schema"
 *
 *   const { data } = matter(raw)
 *   const frontmatter = data as BlogFrontmatter
 */
/** Fields shared by all content types. */
interface BaseFrontmatter {
    /** Display title of the content entry. */
    title: string;
    /** ISO date string (YYYY-MM-DD). */
    date: string;
    /** Categorization tags for filtering and discovery. */
    tags: string[];
    /** When true, the consumer app should exclude this entry in production. */
    draft: boolean;
}
/** Frontmatter for blog entries. */
interface BlogFrontmatter extends BaseFrontmatter {
    /** Short summary shown in listings and SEO meta tags. */
    description: string;
}
/** Frontmatter for LinkedIn entries. */
interface LinkedInFrontmatter extends BaseFrontmatter {
    /** URL to the original LinkedIn post. */
    linkedinUrl: string;
}
/** Frontmatter for project entries. */
interface ProjectFrontmatter extends BaseFrontmatter {
    /** Short summary of the project. */
    description: string;
    /** Technologies used in the project (e.g., ["React", "TypeScript"]). */
    techStack: string[];
    /** URL to the live/deployed project. */
    liveUrl: string;
    /** URL to the source code repository. */
    sourceUrl: string;
    /** When true, highlight this project on the homepage or portfolio page. */
    featured: boolean;
    /** Categorization of the project (e.g., "project", "experiment"). Defaults to "project". */
    category: "project" | "experiment";
}
/** Frontmatter for TIL entries. */
interface TilFrontmatter extends BaseFrontmatter {
}
/** Frontmatter for snippet entries. */
interface SnippetFrontmatter extends BaseFrontmatter {
    /** Short description of what the snippet does. */
    description: string;
    /** Programming language of the snippet (e.g., "typescript", "python"). */
    language: string;
}
/** Frontmatter for thought entries. */
interface ThoughtFrontmatter extends BaseFrontmatter {
}
/** Frontmatter for quote entries. */
interface QuoteFrontmatter extends BaseFrontmatter {
    /** Who said/wrote this. */
    attribution: string;
    /** Where it's from — book, song, film, speech, etc. */
    source?: string;
}
/** Frontmatter for idea entries. */
interface IdeaFrontmatter extends BaseFrontmatter {
    /** Current status of the idea. */
    status: "seed" | "exploring" | "building" | "shipped" | "abandoned";
}
/** Map of content type directory names to their frontmatter types. */
interface ContentTypeMap {
    blog: BlogFrontmatter;
    linkedin: LinkedInFrontmatter;
    projects: ProjectFrontmatter;
    til: TilFrontmatter;
    snippets: SnippetFrontmatter;
    thoughts: ThoughtFrontmatter;
    quotes: QuoteFrontmatter;
    ideas: IdeaFrontmatter;
}
/** Union of all content type directory names. */
type ContentType = keyof ContentTypeMap;
/** A parsed content entry with typed frontmatter. */
interface ContentEntry<T extends ContentType> {
    /** URL slug derived from the directory name. */
    slug: string;
    /** Content type (directory name). */
    type: T;
    /** Parsed YAML frontmatter. */
    frontmatter: ContentTypeMap[T];
    /** Raw markdown body (everything after the frontmatter). */
    content: string;
}

interface ContentLoaderOptions {
    contentDir: string;
}
interface ContentLoader {
    getEntries<T extends ContentType>(type: T): Promise<ContentEntry<T>[]>;
    getEntry<T extends ContentType>(type: T, slug: string): Promise<ContentEntry<T> | null>;
    getAllTags(): Promise<string[]>;
    getEntriesByTag<T extends ContentType>(type: T, tag: string): Promise<ContentEntry<T>[]>;
    getSlugs(type: ContentType): Promise<string[]>;
}
declare function createContentLoader(options: ContentLoaderOptions): ContentLoader;

export { type BaseFrontmatter, type BlogFrontmatter, type ContentEntry, type ContentLoader, type ContentLoaderOptions, type ContentType, type ContentTypeMap, type IdeaFrontmatter, type LinkedInFrontmatter, type ProjectFrontmatter, type QuoteFrontmatter, type SnippetFrontmatter, type ThoughtFrontmatter, type TilFrontmatter, createContentLoader };
