import fs from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";

export async function getContent() {
  const filePath = path.join(process.cwd(), "src", "static", "module.mdx");
  const mdxText = fs.readFileSync(filePath, "utf8");
  const mdxSource = await serialize(mdxText);
  return { props: { mdxSource } };
}
