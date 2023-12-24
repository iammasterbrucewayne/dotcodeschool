// TODO: Refactoring

import Navbar from "@/app/common/components/navbar";
import PrimaryButton from "@/app/common/components/primary-button";
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
import { forEach, get, isEmpty, isString, map, size } from "lodash";
import { getContentByType } from "@/pages/api/get-content";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Module = {
  id: string;
  index: number;
  title: string;
  description: string;
  numOfLessons: number;
};

interface ModuleProps {
  module: Module;
  slug: string;
}

const Module = ({ module, slug }: ModuleProps) => {
  const { index, title, description } = module;
  const [progress, setProgress] = useState(0);
  const progressData = useContext(ProgressProvider);

  const countCompletedChapters = (
    courseId: string,
    lessonId?: string,
    progressData?: any
  ) => {
    // Count the completed chapters
    let count = 0;
    const progressDataParsed = isString(progressData)
      ? JSON.parse(progressData)
      : progressData;
    if (lessonId) {
      // Count the completed chapters for a specific lesson
      forEach(progressDataParsed[courseId]?.[lessonId], (chapter) => {
        if (chapter) {
          count++;
        }
      });
    } else {
      // Count the completed chapters for the entire course
      for (const lessonId in progressDataParsed[courseId] || {}) {
        count += countCompletedChapters(courseId, lessonId);
      }
    }

    return count;
  };

  useEffect(() => {
    if (!isEmpty(progressData)) {
      const completedChaptersCount = countCompletedChapters(
        slug,
        `${index + 1}`,
        progressData
      );

      const _progress = Number(
        ((completedChaptersCount / module.numOfLessons) * 100).toFixed(0)
      );
      setProgress(_progress);
    }
  }, [slug, index, progressData, module.numOfLessons]);

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
        <PrimaryButton
          as="a"
          href={`/courses/${slug}/lesson/${index + 1}/chapter/1`}
          mt={12}
        >
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

type Author = {
  name: string;
  url: string;
};

interface CoursePageProps {
  slug: string;
  title: string;
  author: Author;
  description: string;
  modules: Module[];
  tags: { language: string; level: string };
}

const ProgressProvider = createContext({});

const CoursePage = ({
  slug,
  title,
  author,
  description,
  modules,
  tags,
}: CoursePageProps) => {
  const { data: session } = useSession();
  const [progressData, setProgressData] = useState({});

  const getProgress = async (session: any) => {
    // Load the progress from local storage
    const localProgress: any = localStorage.getItem("progress");

    // Load the progress from the database
    const savedProgress = session && (session.user?.progress || null);

    // Merge the progress from local storage and the database
    const progress = JSON.parse(
      savedProgress
        ? JSON.stringify(savedProgress)
        : JSON.stringify(localProgress) || "{}"
    );

    if (savedProgress) {
      // Save the progress back to local storage
      localStorage.setItem("progress", JSON.stringify(progress));
    }

    return progress;
  };

  useEffect(() => {
    getProgress(session).then((progress) => {
      setProgressData(JSON.parse(JSON.stringify(progress)));
    });
  }, [session]);

  return (
    <ProgressProvider.Provider value={progressData}>
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
            <Module key={index} module={module} slug={slug} />
          ))}
        </Accordion>
      </Box>
    </ProgressProvider.Provider>
  );
};

export default CoursePage;

export async function getStaticProps({
  params,
}: {
  params: {
    course: string;
  };
}) {
  const res = await getContentByType("courseModule");
  const entry = res.items[0];

  const { moduleName, moduleDescription, author, level, language } =
    entry.fields as any;

  const authorFields = author.fields;

  if (!authorFields) {
    throw new Error("Author fields are undefined");
  }

  const { name, url }: Author = authorFields;

  const sections = entry.fields.sections;

  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    throw new Error(
      "Failed to fetch the entry from Contentful or sections array is null or empty"
    );
  }

  const modules = map(sections, (lesson, index) => {
    if (!lesson) {
      throw new Error("Lesson is undefined");
    }

    return {
      index,
      id: get(lesson, "sys.id"),
      title: get(lesson, "fields.title"),
      description: get(lesson, "fields.description"),
      numOfLessons: get(lesson, "fields.lessons.length"),
    };
  });

  return {
    props: {
      slug: params.course,
      title: moduleName,
      author: {
        name,
        url,
      },
      description: moduleDescription,
      modules,
      tags: { language, level },
    },
  };
}

export async function getStaticPaths() {
  const res = await getContentByType("courseModule");
  const paths = res.items.map((item: any) => ({
    params: {
      course: item.fields.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}
