import Navbar from "@/app/common/components/navbar";
import PrimaryButton from "@/app/common/components/primary-button";
import courseModules from "@/static/course-modules";
import { ArrowBackIcon, CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
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
  Tag,
  Progress,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { map, size } from "lodash";

interface Module {
  title: string;
  description: string;
  progress?: number;
}

interface ModuleProps {
  module: Module;
}

const Module = ({ module }: ModuleProps) => {
  const { title, description, progress = 0 } = module;

  return (
    <AccordionItem>
      <AccordionButton py={6}>
        <VStack spacing={4} w="full" align="start">
          <HStack w="full">
            <Text flex="1" textAlign="left" fontWeight="semibold" fontSize="xl">
              {title}
            </Text>
            <AccordionIcon fontSize={48} />
          </HStack>
          <VStack w="90%" align="end">
            <Progress
              colorScheme="green"
              w="full"
              value={progress}
              size="sm"
              rounded="full"
            />
            <Text fontSize="sm" fontWeight="500" color="gray.400">
              {progress}% Complete
            </Text>
          </VStack>
        </VStack>
      </AccordionButton>
      <AccordionPanel pb={12} w="90%" pt={0}>
        <Text>{description}</Text>
        <PrimaryButton as="a" href="/courses/1" mt={12}>
          Start Lesson
        </PrimaryButton>
      </AccordionPanel>
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
  tags: { language: string; level: string };
}

const CoursePage = ({
  title = "Rust State Machine: Basic Concepts for Blockchain Developement",
  author = { name: "Shawn Tabrizi", url: "https://twitter.com/ShawnTabrizi" },
  description = "This is an introductory course on how to develop a simple state machine using Rust, inspired by the Polkadot SDK. It's designed to teach various entry-level concepts around Rust and blockchain development. This tutorial is unique as it builds everything from scratch, without relying on any external libraries like FRAME, offering a deeper understanding of the underlying mechanisms.",
  modules = courseModules,
  tags = { language: "Rust", level: "Beginner" },
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
      {map(tags, (tag, key) => (
        <Tag key={key} mr={2} mb={2}>
          {tag}
        </Tag>
      ))}
      <ModuleList modules={modules} />
      <Heading as="h2" size="lg" fontWeight="800" my={8}>
        Course Content
      </Heading>
      <Text mt={4} mb={8} color="gray.400" fontWeight="500">
        {size(modules)} lessons
      </Text>
      <Accordion allowToggle>
        {modules.map((module, index) => (
          <Module key={index} module={module} />
        ))}
      </Accordion>
    </Box>
  );
};

export default CoursePage;
