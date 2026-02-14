# trickle

Typed content loader for a git-backed markdown CMS. Reads `<type>/<slug>/index.md` files, parses YAML frontmatter with gray-matter, filters drafts, sorts by date descending, and exposes a factory API.

## Architecture

```
src/
├── index.ts       # Public API re-exports
├── loader.ts      # createContentLoader factory — wires everything together
├── discovery.ts   # Glob-based file discovery (<type>/*/index.md)
├── parser.ts      # gray-matter wrapper, date normalization, draft filtering
├── sorting.ts     # Immutable date-descending sort
└── schema.ts      # All frontmatter types (copied from content repo)
```

The data flow is: `discovery` finds files → `parser` reads and parses each one → `sorting` orders the results → `loader` orchestrates it all behind the `ContentLoader` interface.

## Key decisions

- **gray-matter converts YAML dates to Date objects.** The parser normalizes them back to `YYYY-MM-DD` strings (see `parser.ts:15-17`). This is intentional — the schema defines `date` as `string`.
- **Draft filtering happens in the parser**, not the loader. `parseEntry` returns `null` for drafts. The loader filters out nulls. Exception: `getSlugs` bypasses the parser entirely and returns all slugs including drafts (needed for static path generation).
- **Sorting is always immutable.** `sortByDateDesc` spreads before sorting — never mutates the input array.
- **`CONTENT_TYPES` array in `loader.ts`** is the source of truth for which directories exist. When adding a new content type, update this array, add the interface to `schema.ts`, and add it to `ContentTypeMap`.
- **No MDX bundled.** The `content` field returns raw markdown. Consumer handles compilation.
- **`dist/` is committed** so `npm install github:chinmaykunkikar/trickle` works without a build step at install time.

## Schema sync

`src/schema.ts` is a manual copy from the content repo's `schema.ts`. When the content repo adds or changes frontmatter fields, this file must be updated to match, then rebuild with `npm run build`.

## Commands

```bash
npm run build      # tsup → ESM + CJS + .d.ts in dist/
npm test           # vitest (22 tests across 3 files)
npm run test:watch # vitest in watch mode
```

## Tests

Tests live in `tests/` with fixture content in `tests/fixtures/`. Fixtures include:
- Blog entries (published + draft + older post for sort order testing)
- A TIL entry
- A project entry with extra frontmatter fields

Test files map 1:1 to source modules: `discovery.test.ts`, `parser.test.ts`, `loader.test.ts`.

## Adding a new content type

1. Add the interface to `src/schema.ts` extending `BaseFrontmatter`
2. Add it to `ContentTypeMap` in `src/schema.ts`
3. Add the type string to `CONTENT_TYPES` in `src/loader.ts`
4. Re-export the new type from `src/index.ts`
5. Add a test fixture in `tests/fixtures/<type>/<slug>/index.md`
6. Run `npm run build` to regenerate `dist/`

## Git conventions

- Plain, descriptive commit messages — no conventional commit prefixes.
- Always push to remote when committing.
