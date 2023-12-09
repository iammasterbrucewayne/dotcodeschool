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
import { useState } from "react";
import { map } from "lodash";

interface BottomNavbarProps {
  current: number;
  prev?: number;
  next?: number;
  modules: any[];
  checkAnswer?: () => void;
}

const BottomNavbar = ({
  current,
  prev,
  next,
  modules,
  checkAnswer,
}: BottomNavbarProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

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
          {checkAnswer && (
            <Button variant="outline" onClick={checkAnswer}>
              Check Answers
            </Button>
          )}
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
              variant="solid"
              colorScheme="green"
              px={[4, 8]}
              mr={4}
              gap={2}
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
              {map(modules, (module) => {
                const isCurrent = current === Number(module.lesson);
                return (
                  <Link
                    key={module.id}
                    display="block"
                    href={`/courses/${module.lesson}`}
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
                    {module.lesson}. {module.title}
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
