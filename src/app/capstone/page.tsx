import type { Metadata } from "next";
import { CapstoneView } from "@/components/CapstoneView";
import { capstonePages } from "@/lib/capstone";

export default function CapstoneOverviewPage() {
  return <CapstoneView slug="overview" />;
}

export const metadata: Metadata = {
  title: capstonePages[0].title,
  description: capstonePages[0].summary,
};
