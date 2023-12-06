import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { getContent } from "../api/get-content";
import MDXComponents from "@/app/common/components/mdx-components";
import {
  Box,
  Grid,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import TerminalEmulator from "@/app/common/components/terminal-emulator";
import Navbar from "@/app/common/components/navbar";
import { map } from "lodash";

type File = {
  fileName: string;
  code: string;
  language: string;
};

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
    <Box h="100vh" px={[6, 12]} mx="auto">
      <Navbar cta={false} />
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem
          colSpan={[12, 5]}
          h={["fit-content", "90vh"]}
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
        <GridItem colSpan={[12, 7]} h="85vh" overflow="clip">
          {MODE === MODES.EDITOR ? (
            <EditorTabs files={files} />
          ) : (
            <TerminalEmulator h="100%" />
          )}
        </GridItem>
      </Grid>
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
      <TabPanels h="95%" pt={2}>
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

export async function getStaticProps() {
  const res = await getContent("7ypOiKAixXIT9uI2F2QRrS");
  return res;
}
