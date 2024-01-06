import {
  Box,
  Flex,
  IconButton,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Text,
  Link,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
} from "@chakra-ui/icons";
import { useCallback, useEffect, useState } from "react";
import { map } from "lodash";
import axios from "axios";
import { useSession } from "next-auth/react";

interface BottomNavbarProps {
  isCorrect?: boolean;
  courseId: string;
  lessonId: string;
  chapterId: string;
  current: string;
  prev?: string;
  next?: string;
  chapters: any[];
  checkAnswer?: () => void;
}

const BottomNavbar = ({
  isCorrect,
  courseId,
  lessonId,
  chapterId,
  current,
  prev,
  next,
  chapters,
  checkAnswer,
}: BottomNavbarProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: session } = useSession();

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // TODO: Refactor this to a custom hook
  const saveProgress = useCallback(async (
    courseId: string,
    lessonId: string,
    chapterId: string
  ) => {
    // Load the progress from local storage
    const localProgress: any = localStorage.getItem("progress");

    // Load the progress from the database
    const savedProgress = session
      ? await axios
          .get("/api/get-progress", {
            params: { user: session?.user },
          })
          .then((res) => {
            return res.data.progress;
          })
          .catch((err) => {
            console.error(err);
          })
      : null;

    // Merge the progress from local storage and the database
    const progress = JSON.parse(
      savedProgress ? savedProgress : localProgress || "{}"
    );

    // Update the progress
    if (!progress[courseId]) {
      progress[courseId] = {};
    }
    if (!progress[courseId][lessonId]) {
      progress[courseId][lessonId] = {};
    }
    progress[courseId][lessonId][chapterId] = true;

    // Save the progress back to local storage
    localStorage.setItem("progress", JSON.stringify(progress));

    // Save the progress to the database
    if (session) {
      axios
        .post("/api/update-progress", {
          updates: [{ user: session?.user, progress }],
        })
        .catch((err) => {
          console.error(err);
          const pendingUpdates = JSON.parse(
            localStorage.getItem("pendingUpdates") || "[]"
          );
          pendingUpdates.push({ courseId, lessonId, chapterId });
          localStorage.setItem(
            "pendingUpdates",
            JSON.stringify(pendingUpdates)
          );
        });
    } else {
      const pendingUpdates = JSON.parse(
        localStorage.getItem("pendingUpdates") || "[]"
      );
      pendingUpdates.push({ courseId, lessonId, chapterId });
      localStorage.setItem("pendingUpdates", JSON.stringify(pendingUpdates));
    }
  }, [session]);

  useEffect(() => {
    const syncProgress = () => {
      if (session) {
        const pendingUpdates = JSON.parse(
          localStorage.getItem("pendingUpdates") || "[]"
        );
        pendingUpdates.forEach((update: any) => {
          saveProgress(update.courseId, update.lessonId, update.chapterId);
        });
        localStorage.setItem("pendingUpdates", "[]");
      }
    };
    syncProgress();
  }, [session, saveProgress]);

  return (
    <Box
      position="fixed"
      w="100%"
      bottom={0}
      left={0}
      py={4}
      px={4}
      bg="gray.900"
    >
      <Flex justify="space-between" align="center">
        <IconButton
          aria-label="Open navigation drawer"
          icon={<HamburgerIcon />}
          onClick={handleDrawerOpen}
        />

        <Flex gap={2}>
          {checkAnswer &&
            (isCorrect ? (
              <Button
                variant="ghost"
                colorScheme="green"
                cursor="default"
                _hover={{ bg: "none" }}
              >
                <CheckIcon fontSize={16} mr={2} />
                Correct
              </Button>
            ) : (
              <Button variant="outline" onClick={checkAnswer}>
                Check Answers
              </Button>
            ))}
          {prev ? (
            <Button
              as={Link}
              href={`/courses/${prev}`}
              variant="ghost"
              gap={2}
              _hover={{ textDecor: "none", color: "green.300" }}
            >
              <ChevronLeftIcon fontSize={24} />
              <Text display={["none", "block"]}>Back</Text>
            </Button>
          ) : (
            ""
          )}
          {next ? (
            <Button
              as={Link}
              onClick={() => {
                saveProgress(courseId, lessonId, chapterId);
              }}
              href={`/courses/${next}`}
              variant="ghost"
              gap={2}
              _hover={{ textDecor: "none", color: "green.300" }}
            >
              <Text display={["none", "block"]}>Next</Text>
              <ChevronRightIcon fontSize={24} />
            </Button>
          ) : (
            <Button
              as={Link}
              variant="solid"
              colorScheme="green"
              px={[4, 8]}
              mr={4}
              gap={2}
              href={`/courses/${courseId}/lesson/${lessonId}/success`}
              onClick={() => {
                saveProgress(courseId, lessonId, chapterId);
              }}
              _hover={{ textDecor: "none" }}
            >
              <Text display={["none", "block"]}>Finish</Text>
              <CheckIcon fontSize={16} />
            </Button>
          )}
        </Flex>
      </Flex>

      <Drawer
        isOpen={isDrawerOpen}
        placement="left"
        onClose={handleDrawerClose}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Lessons</DrawerHeader>
            <DrawerBody px={0}>
              {map(chapters, (chapter) => {
                const isCurrent = current === chapter.lesson;
                return (
                  <Link
                    key={chapter.id}
                    display="block"
                    href={`/courses/${chapter.lesson}`}
                    w="full"
                    py={2}
                    px={4}
                    color={isCurrent ? "gray.700" : ""}
                    bg={isCurrent ? "green.300" : ""}
                    fontWeight={isCurrent ? "semibold" : "normal"}
                    _hover={{
                      textDecor: "none",
                      bg: isCurrent ? "green.300" : "gray.600",
                    }}
                  >
                    {chapter.index + 1}. {chapter.title}
                  </Link>
                );
              })}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default BottomNavbar;
