import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TypeScript Reference",
    template: "%s | TypeScript Reference",
  },
  description:
    "A concise, code-first TypeScript reference for JavaScript developers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/*
        suppressHydrationWarning: browser extensions commonly inject attributes
        onto <body> (e.g. cz-shortcut-listen) between the server HTML arriving and
        React hydrating, which React reports as a mismatch. This opts out of
        attribute diffing for THIS element only - children are still checked
        normally, so real hydration bugs are not hidden.
      */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
