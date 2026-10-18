import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
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

/** Lets the browser colour its own chrome (address bar, overscroll) to match the page. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d11" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /*
      suppressHydrationWarning on <html>: the boot script below may set `data-theme` before
      React hydrates, which React would otherwise report as a mismatch. It opts out of
      attribute diffing for this one element only.
    */
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      {/*
        suppressHydrationWarning: browser extensions commonly inject attributes
        onto <body> (e.g. cz-shortcut-listen) between the server HTML arriving and
        React hydrating, which React reports as a mismatch. This opts out of
        attribute diffing for THIS element only - children are still checked
        normally, so real hydration bugs are not hidden.
      */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-accent-solid focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-solid-fg"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
