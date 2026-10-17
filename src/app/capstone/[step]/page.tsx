import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CapstoneView } from "@/components/CapstoneView";
import { capstonePages, findCapstonePage, type CapstoneSlug } from "@/lib/capstone";

/**
 * `overview` is served by `/capstone` itself, so it is excluded here. That is what
 * keeps `/capstone/overview` from becoming a second URL for the same page.
 */
type StepSlug = Exclude<CapstoneSlug, "overview">;

function isStepSlug(value: string): value is StepSlug {
  return value !== "overview" && capstonePages.some((page) => page.slug === value);
}

export default async function CapstoneStepPage(props: PageProps<"/capstone/[step]">) {
  const { step } = await props.params;
  if (!isStepSlug(step)) notFound();
  return <CapstoneView slug={step} />;
}

export async function generateMetadata(props: PageProps<"/capstone/[step]">): Promise<Metadata> {
  const { step } = await props.params;
  const page = findCapstonePage(step);
  return page ? { title: page.title, description: page.summary } : {};
}

export function generateStaticParams(): Array<{ step: StepSlug }> {
  return capstonePages.flatMap((page) => (isStepSlug(page.slug) ? [{ step: page.slug }] : []));
}

export const dynamicParams = false;
