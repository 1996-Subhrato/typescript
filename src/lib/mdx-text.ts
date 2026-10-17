/**
 * Turns MDX source into plain searchable prose.
 *
 * Pure string handling with no imports, so it is safe anywhere and easy to test. What it
 * keeps and drops:
 *
 *   dropped  fenced code blocks, MDX comments (`{/* ... *\/}`), heading markers,
 *            table separator rows, link targets, emphasis markers
 *   kept     inline code CONTENT (`keyof` is a search term worth finding), link text,
 *            table cell text, everything else
 */
export function extractText(source: string): string {
  return (
    source
      // fenced code blocks, anchored at line starts
      .replace(/^```[\s\S]*?^```[^\n]*$/gm, " ")
      // MDX comments, such as the check:skip marker
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
      // heading markers (the heading text stays)
      .replace(/^#{1,6}\s+/gm, "")
      // table separator rows like | --- | :---: |
      .replace(/^\s*\|?\s*:?-{3,}:?(?:\s*\|\s*:?-{3,}:?)*\s*\|?\s*$/gm, " ")
      // links: keep the text, drop the target
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      // inline code: keep the content, drop the backticks
      .replace(/(`+)([\s\S]*?)\1/g, "$2")
      // emphasis and bold markers
      .replace(/\*{1,3}/g, "")
      // blockquote markers and table pipes
      .replace(/^\s*>\s?/gm, "")
      .replace(/\\\|/g, "|")
      .replace(/\|/g, " ")
      // collapse whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}
