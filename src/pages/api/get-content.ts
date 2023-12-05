import { createClient } from "contentful";
import { serialize } from "next-mdx-remote/serialize";

export async function getContent(entryId: string) {
  const {
    CONTENTFUL_SPACE_ID,
    CONTENTFUL_ENVIRONMENT,
    CONTENTFUL_ACCESS_TOKEN,
  } = process.env;

  if (
    !CONTENTFUL_SPACE_ID ||
    !CONTENTFUL_ENVIRONMENT ||
    !CONTENTFUL_ACCESS_TOKEN
  ) {
    throw new Error("Contentful environment variables are not set");
  }

  const client = createClient({
    space: CONTENTFUL_SPACE_ID,
    environment: CONTENTFUL_ENVIRONMENT,
    accessToken: CONTENTFUL_ACCESS_TOKEN,
  });

  const entry = await client.getEntry<any>(entryId).catch(console.error);

  if (!entry || typeof entry.fields.lessonContent !== "string") {
    throw new Error(
      "Failed to fetch the entry from Contentful or lessonContent is not a string"
    );
  }

  const mdxSource = await serialize(entry.fields.lessonContent);

  return { props: { mdxSource } };
}
