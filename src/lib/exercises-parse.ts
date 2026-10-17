/**
 * Pulls the exercises out of a topic's `## Practice` section.
 *
 * Pure string handling with no imports, so it is safe anywhere and easy to test. Two shapes
 * occur in the content:
 *
 *   - a numbered list: each item is one exercise
 *   - a short passage (sometimes with bullets): the whole section is one exercise
 *
 * Fenced code inside an exercise is not kept, only noted (`hasCode`), because the page links
 * back to the topic where the starter code is shown with syntax highlighting.
 */
export interface Exercise {
  /** The exercise as one line of Markdown-flavoured prose (inline code and links preserved). */
  readonly text: string;
  /** Bullet points belonging to the exercise, if it has any. */
  readonly points: readonly string[];
  /** True when the exercise includes a code block (starter code) shown on the topic page. */
  readonly hasCode: boolean;
}

const FENCE = /^\s*```/;
const NUMBERED = /^\d+\.\s+/;

/** The lines of the `## Practice` section, up to the next `##` heading. */
function practiceSection(source: string): string[] | null {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === "## Practice");
  if (start === -1) return null;

  const section: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (/^## /.test(line)) break;
    section.push(line);
  }
  return section;
}

/** Splits a section into one group of lines per exercise. */
function splitUnits(section: readonly string[]): string[][] {
  if (!section.some((line) => NUMBERED.test(line))) return [[...section]];

  const units: string[][] = [];
  let current: string[] | null = null;
  let inFence = false;

  for (const line of section) {
    if (FENCE.test(line)) inFence = !inFence;
    if (!inFence && NUMBERED.test(line)) {
      current = [line.replace(NUMBERED, "")];
      units.push(current);
    } else if (current) {
      current.push(line);
    }
  }
  return units;
}

function toExercise(lines: readonly string[]): Exercise | null {
  let inFence = false;
  let hasCode = false;
  const textParts: string[] = [];
  const points: string[] = [];

  for (const raw of lines) {
    if (FENCE.test(raw)) {
      inFence = !inFence;
      hasCode = true;
      continue;
    }
    if (inFence) continue;

    const bullet = /^\s*[-*]\s+(.*)$/.exec(raw);
    if (bullet?.[1] !== undefined) {
      points.push(bullet[1].trim());
    } else if (raw.trim() !== "") {
      // An indented line right after a bullet continues that bullet.
      if (points.length > 0 && /^\s{2,}\S/.test(raw)) {
        const last = points.length - 1;
        points[last] = `${points[last] ?? ""} ${raw.trim()}`;
      } else {
        textParts.push(raw.trim());
      }
    }
  }

  const text = textParts.join(" ").replace(/\s+/g, " ").trim();
  if (text === "" && points.length === 0) return null;
  return { text, points, hasCode };
}

export function extractExercises(source: string): Exercise[] {
  const section = practiceSection(source);
  if (section === null) return [];

  return splitUnits(section).flatMap((unit) => {
    const exercise = toExercise(unit);
    return exercise ? [exercise] : [];
  });
}
