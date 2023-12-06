import { createClient } from "contentful";
import { map } from "lodash";
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

  if (
    !entry.fields.files ||
    !Array.isArray(entry.fields.files) ||
    entry.fields.files.length === 0
  ) {
    throw new Error(
      "Failed to fetch the entry from Contentful or files array is null or empty"
    );
  }

  const files = await Promise.all(
    map(entry.fields.files, async (file: any) => {
      if (typeof file !== "object" || !file.fields) {
        throw new Error("File is not an object or file.fields is null");
      }

      const { url, fileName } = file.fields.file;
      const response = await fetch(`https:${url}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        fileName,
        code: await response.text(),
      };
    })
  ).catch(console.error);

  const mdxSource = await serialize(entry.fields.lessonContent);

  return { props: { mdxSource, files } };
}
