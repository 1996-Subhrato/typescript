import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `.mdx` files live in `src/content` and are pulled in via dynamic import,
  // so they are deliberately NOT added to `pageExtensions` — content files
  // must never become routes on their own.
  pageExtensions: ["ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    // Turbopack (the Next 16 default) cannot receive JS functions, so remark/rehype
    // plugins are referenced by name with serializable options only.
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-pretty-code",
        {
          theme: { light: "github-light", dark: "github-dark" },
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
