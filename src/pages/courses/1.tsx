import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { getContent } from "../api/get-content";
import MDXComponents from "@/app/common/components/mdx-components";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import TerminalEmulator from "@/app/common/components/terminal-emulator";
import Navbar from "@/app/common/components/navbar";

interface Props {
  mdxSource: MDXRemoteSerializeResult;
}

export default function CourseModule({ mdxSource }: Props) {
  return (
    <Box h="100vh" px={12} mx="auto">
      <Navbar cta={false} />
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        <GridItem colSpan={5} h="90vh" overflow="scroll" pr={6} pt={4}>
          <MDXRemote {...mdxSource} components={MDXComponents} />
        </GridItem>
        <GridItem colSpan={7} h="85vh" overflow="clip">
          <TerminalEmulator h="100%" />
        </GridItem>
      </Grid>
    </Box>
  );
}

export async function getStaticProps() {
  const res = await getContent();
  return res;
}
