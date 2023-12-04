import Navbar from "@/app/common/components/navbar";
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
} from "@chakra-ui/react";

interface Module {
  title: string;
  content: string;
}

const Module = ({ title, content }: Module) => {
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
    <Box mb={4}>
      <Heading as="h2" size="lg" mb={2}>
        What you'll learn:
      </Heading>
      <ul>
        {modules.map((module, index) => (
          <li key={index}>{module.title}</li>
        ))}
      </ul>
    </Box>
  );
};

const CoursePage = () => {
  const modules: Module[] = [
    { title: "Module 1", content: "Module 1 content" },
    { title: "Module 2", content: "Module 2 content" },
    { title: "Module 3", content: "Module 3 content" },
  ];

  return (
    <Box>
      <Navbar cta={false} />
      <Button
        as={Link}
        href="/"
        variant="outline"
        mb={4}
        _hover={{ textDecoration: "none" }}
      >
        Back
      </Button>
      <Heading as="h1" size="xl" mb={4}>
        Course Title
      </Heading>
      <Text>
        Author:{" "}
        <Link href="https://twitter.com/author" isExternal>
          @author
        </Link>
      </Text>
      <Text mb={4}>Short course description</Text>
      <ModuleList modules={modules} />
      <Accordion allowToggle>
        {modules.map((module, index) => (
          <Module key={index} title={module.title} content={module.content} />
        ))}
      </Accordion>
    </Box>
  );
};

export default CoursePage;
