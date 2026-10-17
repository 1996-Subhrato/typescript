import { buildSearchIndex } from "@/lib/search-index";

/**
 * The full-text search index, served as static JSON.
 *
 * `force-static` makes Next.js build it once at `next build` instead of on every request.
 * It is fetched lazily by the search palette the first time it is opened. Because it is
 * derived from the MDX files at build time there is no generated file to commit or to
 * go stale.
 */
export const dynamic = "force-static";

export async function GET(): Promise<Response> {
  return Response.json(await buildSearchIndex());
}
