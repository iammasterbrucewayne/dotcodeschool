import { createClient } from "contentful";

function initContentfulClient() {
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

  return client;
}

export async function getContentById(entryId: string) {
  const client = initContentfulClient();
  const entry = await client.getEntry(entryId);
  return entry;
}

export async function getContentByType(contentType: string) {
  const client = initContentfulClient();
  const entry = await client.getEntries({
    content_type: contentType,
  });
  return entry;
}
