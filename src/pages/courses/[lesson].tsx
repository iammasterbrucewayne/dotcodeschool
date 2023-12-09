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
  Text,
  useToast,
} from "@chakra-ui/react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import _, { filter, find, isEmpty, map, matches, nth } from "lodash";
import { serialize } from "next-mdx-remote/serialize";
import Editor, { DiffEditor } from "@monaco-editor/react";
import stripComments from "strip-comments";

import { getContentById } from "../api/get-content";
import MDXComponents from "@/app/common/components/lessons-interface/mdx-components";
import Navbar from "@/app/common/components/navbar";
import TerminalEmulator from "@/app/common/components/lessons-interface/terminal-emulator";
import BottomNavbar from "@/app/common/components/lessons-interface/bottom-navbar";
import { useEffect, useState } from "react";

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
  const { source, template, solution } = files;
  const readOnly = isEmpty(solution);
  const rawFiles = !isEmpty(source) ? source : template;
  const _files = filter(rawFiles, (file) => !file.fileName.endsWith(".diff"));

  const toast = useToast();

  const [editorContent, setEditorContent] = useState(_files);
  const [isCorrect, setIsCorrect] = useState(false);
  const [incorrectFiles, setIncorrectFiles] = useState<File[]>([]);
  const [checkedAnswer, setCheckedAnswer] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const checkAnswer = () => {
    const incorrect: File[] = [];
    const _isCorrectArr = map(_files, (file, index) => {
      if (file.fileName.endsWith(".diff")) return true;
      const solutionFile = solution[index];
      // Remove comments and whitespace
      const fileCodeWithoutComments = stripComments(file.code);
      const fileContent = fileCodeWithoutComments.replace(/\s+/g, " ").trim();

      const solutionCodeWithoutComments = stripComments(solutionFile.code);
      const solutionContent = solutionCodeWithoutComments
        .replace(/\s+/g, " ")
        .trim();

      const isFileCorrect = fileContent === solutionContent;
      if (!isFileCorrect) {
        incorrect.push(file);
      }
      return isFileCorrect;
    });
    const _isCorrect = _isCorrectArr.every((isCorrect) => isCorrect);
    if (!_isCorrect) {
      setShowHints(true);
      toast.closeAll();
      toast({
        title: "Incorrect!",
        description: "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIncorrectFiles(incorrect);
    setIsCorrect(_isCorrect);
    setCheckedAnswer(true);
  };
  useEffect(() => {
    if (checkedAnswer) {
      if (isCorrect) {
        toast.closeAll();
        toast({
          title: "Correct!",
          description: "You have passed the lesson",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }, [checkedAnswer, isCorrect, toast]);
  return (
    <Box h="100vh" position="relative">
      <Box h="95vh" px={[6, 12]} mx="auto">
        <Navbar cta={false} />
        <Grid templateColumns="repeat(12, 1fr)" gap={1} pb={24}>
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
          <GridItem colSpan={[12, 7]} overflow="clip">
            {MODE === MODES.EDITOR ? (
              <EditorTabs
                solution={solution}
                incorrectFiles={incorrectFiles}
                showHints={showHints}
                editorContent={editorContent}
                setEditorContent={setEditorContent}
                readOnly={readOnly}
              />
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
        isCorrect={isCorrect}
        {...(!isEmpty(solution) && { checkAnswer })}
      />
    </Box>
  );
}

interface EditorTabsProps {
  showHints: boolean;
  readOnly?: boolean;
  incorrectFiles: File[];
  solution: File[];
  editorContent: File[];
  setEditorContent: (editorContent: File[]) => void;
}

function EditorTabs({
  showHints,
  readOnly,
  incorrectFiles,
  solution,
  editorContent,
  setEditorContent,
}: EditorTabsProps) {
  return (
    <Tabs
      variant="enclosed"
      p={1}
      h="full"
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
        {map(editorContent, (file, i) => {
          const incorrectColor = find(
            incorrectFiles,
            matches({ fileName: file.fileName })
          )
            ? "red.300"
            : null;
          return (
            <Tab
              key={i}
              border="none"
              color={incorrectColor ? incorrectColor : "whiteAlpha.600"}
              _hover={{
                bg: "whiteAlpha.200",
              }}
              _selected={{
                bg: "whiteAlpha.200",
                color: incorrectColor ? incorrectColor : "orange.200",
                borderBottom: "2px solid",
                borderColor: incorrectColor ? incorrectColor : "orange.200",
              }}
            >
              {file.fileName}
            </Tab>
          );
        })}
      </TabList>
      <TabPanels h="80vh" pt={2}>
        {map(editorContent, (file, i) => (
          <TabPanel key={i} h="100%" p={0} pb={6}>
            <Editor
              height={showHints ? "70%" : "100%"}
              theme="vs-dark"
              defaultLanguage={file.language || "rust"}
              defaultValue={file.code || "// placeholder"}
              options={{ readOnly: readOnly }}
              onChange={(value) => {
                const newEditorContent = [...editorContent];
                newEditorContent[i].code = value?.toString() || "";
                setEditorContent(newEditorContent);
              }}
            />
            {showHints && (
              <>
                <Box borderBottom="1px solid" borderColor="whiteAlpha.200">
                  <Text
                    display="inline"
                    fontSize="sm"
                    color="gray.400"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                    borderTopRadius={6}
                    px={4}
                    py={1}
                  >
                    Hints
                  </Text>
                </Box>
                <DiffEditor
                  height="30%"
                  theme="vs-dark"
                  original={
                    showHints ? stripComments(editorContent[i]?.code) : ""
                  }
                  modified={showHints ? stripComments(solution[i]?.code) : ""}
                  options={{ readOnly: true, comments: false }}
                />
              </>
            )}
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
