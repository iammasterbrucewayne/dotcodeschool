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
import { isEmpty, map, nth } from "lodash";
import { serialize } from "next-mdx-remote/serialize";
import Editor from "@monaco-editor/react";

import { getContentById } from "../api/get-content";
import MDXComponents from "@/app/common/components/lessons-interface/mdx-components";
import Navbar from "@/app/common/components/navbar";
import TerminalEmulator from "@/app/common/components/lessons-interface/terminal-emulator";
import BottomNavbar from "@/app/common/components/lessons-interface/bottom-navbar";

type File = {
  fileName: string;
  code: string;
  language: string;
};

interface Files {
  source: File[];
  template: File[];
  solution: File[];
}

interface Props {
  mdxSource: MDXRemoteSerializeResult;
  files: Files;
  current: number;
  prev: number;
  next: number;
  modules: any[];
}

const MODES = {
  TERMINAL: "terminal",
  EDITOR: "editor",
};
const MODE = MODES.EDITOR;

export default function CourseModule({
  mdxSource,
  files,
  current,
  prev,
  next,
  modules,
}: Props) {
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
      <BottomNavbar
        prev={prev}
        next={next}
        current={current}
        modules={modules}
      />
    </Box>
  );
}

interface EditorTabsProps {
  files: Files;
}

function EditorTabs({ files }: EditorTabsProps) {
  const { source, template, solution } = files;
  const _files = !isEmpty(source) ? source : template;
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
      <TabList
        overflowX="auto"
        overflowY="hidden"
        gap={1}
        sx={{
          "::-webkit-scrollbar": {
            height: "1px",
            borderRadius: "8px",
          },
          "::-webkit-scrollbar-thumb": {
            height: "1px",
            borderRadius: "8px",
          },
          ":hover::-webkit-scrollbar-thumb": { background: "gray.700" },
        }}
      >
        {map(_files, (file, i) => {
          return (
            <Tab
              key={i}
              border="none"
              color="gray.500"
              _hover={{
                bg: "whiteAlpha.200",
              }}
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
        {map(_files, (file, i) => (
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
  const entry = await getContentById(id);

  const files: any = entry.fields.files;

  if (!files || typeof files !== "object") {
    throw new Error("Failed to fetch the entry from Contentful");
  }

  if (
    !(files.fields.source || files.fields.template || files.fields.solution)
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
  params: { lesson },
}: {
  params: { lesson: string };
}) {
  const parsedLesson = Number(lesson);
  const courseEntry = await getContentById("1JwFN6H62m8cgaZ2UnHkXj");
  const lessons = getLessons(courseEntry);
  const modules = mapLessonsToModules(lessons);
  const lessonModule = nth(modules, parsedLesson - 1);

  const entry: any = await fetchEntry(lessonModule?.id);

  const files = entry.fields.files;

  const source = await Promise.all(map(files.fields.source, fetchFile)).catch(
    console.error
  );
  const template = await Promise.all(
    map(files.fields.template, fetchFile)
  ).catch(console.error);
  const solution = await Promise.all(
    map(files.fields.solution, fetchFile)
  ).catch(console.error);

  const lessonContent: any = entry.fields.lessonContent;

  const mdxSource = await serialize(lessonContent);

  const prev = parsedLesson > 1 ? parsedLesson - 1 : null;
  const next = parsedLesson < modules.length ? parsedLesson + 1 : null;

  return {
    props: {
      mdxSource,
      files: { source, template, solution },
      current: parsedLesson,
      prev,
      next,
      modules,
    },
  };
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
  return lessons.map((lesson, index) => {
    if (!lesson) {
      throw new Error("Lesson is undefined");
    }

    return {
      lesson: `${index + 1}`,
      id: lesson.sys.id,
      title: lesson.fields.lessonName,
      description: lesson.fields.lessonDescription,
    };
  });
}

export async function getStaticPaths() {
  const entry = await getContentById("1JwFN6H62m8cgaZ2UnHkXj");
  const lessons = getLessons(entry);
  const modules = mapLessonsToModules(lessons);

  const paths = map(modules, (module) => ({
    params: { lesson: module.lesson },
  }));

  return {
    paths,
    fallback: false,
  };
}
