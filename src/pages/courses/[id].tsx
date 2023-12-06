// TODO: Refactoring

import {
  Box,
  Grid,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { map } from "lodash";
import { serialize } from "next-mdx-remote/serialize";
import Editor from "@monaco-editor/react";

import { getContent } from "../api/get-content";
import MDXComponents from "@/app/common/components/lessons-interface/mdx-components";
import Navbar from "@/app/common/components/navbar";
import TerminalEmulator from "@/app/common/components/lessons-interface/terminal-emulator";
import BottomNavbar from "@/app/common/components/lessons-interface/bottom-navbar";

interface File {
  fileName: string;
  code: string;
  language: string;
}

interface Props {
  mdxSource: MDXRemoteSerializeResult;
  files: File[];
}

const MODES = {
  TERMINAL: "terminal",
  EDITOR: "editor",
};
const MODE = MODES.EDITOR;

export default function CourseModule({ mdxSource, files }: Props) {
  return (
    <Box h="100vh" position="relative">
      <Box h="95vh" px={[6, 12]} mx="auto">
        <Navbar cta={false} />
        <Grid templateColumns="repeat(12, 1fr)" gap={1}>
          <GridItem
            colSpan={[12, 5]}
            h={["fit-content", "80vh"]}
            overflowY="auto"
            pr={6}
            pt={4}
            sx={{
              "::-webkit-scrollbar": {
                width: "6px",
                borderRadius: "8px",
              },
              "::-webkit-scrollbar-thumb": {
                width: "6px",
                borderRadius: "8px",
              },
              ":hover::-webkit-scrollbar-thumb": { background: "gray.700" },
            }}
          >
            <MDXRemote {...mdxSource} components={MDXComponents} />
          </GridItem>
          <GridItem colSpan={[12, 7]} h="80vh" overflow="clip">
            {MODE === MODES.EDITOR ? (
              <EditorTabs files={files} />
            ) : (
              <TerminalEmulator h="100%" />
            )}
          </GridItem>
        </Grid>
      </Box>
      <BottomNavbar />
    </Box>
  );
}

interface EditorTabsProps {
  files: File[];
}

function EditorTabs({ files }: EditorTabsProps) {
  return (
    <Tabs
      variant="enclosed"
      p={1}
      h="100%"
      border="1px solid"
      borderColor="whiteAlpha.200"
      bg="#1e1e1e"
      rounded={8}
    >
      <TabList>
        {map(files, (file, i) => {
          return (
            <Tab
              key={i}
              border="none"
              _selected={{
                bg: "whiteAlpha.200",
                color: "orange.200",
                borderBottom: "2px solid",
                borderColor: "orange.200",
              }}
            >
              {file.fileName}
            </Tab>
          );
        })}
      </TabList>
      <TabPanels h="90%" pt={2}>
        {map(files, (file, i) => (
          <TabPanel key={i} h="100%" p={0}>
            <Editor
              height="100%"
              theme="vs-dark"
              defaultLanguage={file.language || "rust"}
              defaultValue={file.code || "// some comment"}
            />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}

async function fetchEntry(id: string) {
  const entry = await getContent(id);
  if (
    !entry.fields.files ||
    !Array.isArray(entry.fields.files) ||
    entry.fields.files.length === 0
  ) {
    throw new Error(
      "Failed to fetch the entry from Contentful or files array is null or empty"
    );
  }
  return entry;
}

async function fetchFile(file: any) {
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
}

export async function getStaticProps({
  params: { id },
}: {
  params: { id: string };
}) {
  const entry: any = await fetchEntry(id);

  const files = await Promise.all(map(entry.fields.files, fetchFile)).catch(
    console.error
  );

  const lessonContent: any = entry.fields.lessonContent;

  const mdxSource = await serialize(lessonContent);

  return { props: { mdxSource, files } };
}

// Validates and returns the lessons array
function getLessons(entry: any) {
  const lessons = entry.fields.lessons;
  if (!lessons || !Array.isArray(lessons) || lessons.length === 0) {
    throw new Error(
      "Failed to fetch the entry from Contentful or lessons array is null or empty"
    );
  }
  return lessons;
}

// Maps lessons to modules
function mapLessonsToModules(lessons: any[]) {
  return lessons.map((lesson) => {
    if (!lesson) {
      throw new Error("Lesson is undefined");
    }

    return {
      id: lesson.sys.id,
      title: lesson.fields.lessonName,
      description: lesson.fields.lessonDescription,
    };
  });
}

export async function getStaticPaths() {
  const entry = await getContent("1JwFN6H62m8cgaZ2UnHkXj");
  const lessons = getLessons(entry);
  const modules = mapLessonsToModules(lessons);

  return {
    paths: map(modules, (module) => ({
      params: { id: module.id },
    })),
    fallback: false,
  };
}
