import { publishedTopics } from "@/lib/docs";

/** Where the "Docs" links go: the first published topic, so they never point at a 404. */
export function firstTopicHref(): string {
  const first = publishedTopics[0];
  return first ? `/docs/${first.topic.slug}` : "/";
}
