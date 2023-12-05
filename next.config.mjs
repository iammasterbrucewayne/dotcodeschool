import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = { pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"] };

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeRaw, rehypeSanitize],
  },
});

export default withMDX(nextConfig);
