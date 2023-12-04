import Navbar from "@/app/common/components/navbar";
import { ArrowBackIcon, CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  Link,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Grid,
  GridItem,
} from "@chakra-ui/react";

interface Module {
  title: string;
  content: string;
}

interface ModuleProps {
  module: Module;
}

const Module = ({ module }: ModuleProps) => {
  const { title, content } = module;

  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            {title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>{content}</AccordionPanel>
    </AccordionItem>
  );
};

interface ModuleListProps {
  modules: Module[];
}

const ModuleList = ({ modules }: ModuleListProps) => {
  return (
    <Box
      bg="gray.700"
      border="2px solid"
      borderColor="gray.600"
      shadow="2xl"
      my={12}
      p={8}
      rounded={16}
    >
      <Heading as="h2" size="lg" mb={6}>
        What you&apos;ll learn:
      </Heading>
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
        gap={4}
        mb={4}
      >
        {modules.map((module, index) => (
          <GridItem key={index} colSpan={1}>
            <CheckCircleIcon color="green.200" mr={2} />
            {module.title}
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

interface CoursePageProps {
  title: string;
  author: { name: string; url: string };
  description: string;
  modules: Module[];
}

const CoursePage = ({
  title = "Rust State Machine: Basic Concepts for Blockchain Developement",
  author = { name: "Shawn Tabrizi", url: "https://twitter.com/ShawnTabrizi" },
  description = "This is an introductory course on how to develop a simple state machine using Rust, inspired by the Polkadot SDK. It's designed to teach various entry-level concepts around Rust and blockchain development. This tutorial is unique as it builds everything from scratch, without relying on any external libraries like FRAME, offering a deeper understanding of the underlying mechanisms.",
  modules = [
    { title: "Rust Programming Basics", content: "Module 1 content" },
    { title: "State Machine Design", content: "Module 2 content" },
    {
      title: "Polkadot SDK and Substrate Influence",
      content: "Module 3 content",
    },
    { title: "Macro Utilization in Rust", content: "Module 3 content" },
    { title: "Blockchain Principles", content: "Module 3 content" },
    {
      title: "Error Handling and State Management",
      content: "Module 3 content",
    },
    { title: "Practical Application", content: "Module 3 content" },
  ],
}: CoursePageProps) => {
  return (
    <Box maxW="6xl" mx="auto" px={[4, 12]}>
      <Navbar cta={false} />
      <Link href="/" color="green.500" fontSize="5xl">
        <ArrowBackIcon />
      </Link>
      <Heading as="h1" size="xl" fontWeight="800" my={4}>
        {title}
      </Heading>
      <Text>
        Written by{" "}
        <Link color="green.300" href={author.url} isExternal>
          {author.name}
        </Link>
      </Text>
      <Text my={8}>{description}</Text>
      <ModuleList modules={modules} />
      <Accordion allowToggle>
        {modules.map((module, index) => (
          <Module key={index} module={module} />
        ))}
      </Accordion>
    </Box>
  );
};

export default CoursePage;
