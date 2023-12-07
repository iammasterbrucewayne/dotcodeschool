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
} from "@chakra-ui/icons";
import { useState } from "react";
import { map } from "lodash";

interface BottomNavbarProps {
  prev?: number;
  next?: number;
  modules: any[];
}

const BottomNavbar = ({ prev, next, modules }: BottomNavbarProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Box
      position="absolute"
      w="100%"
      bottom={0}
      left={0}
      py={4}
      px={[0, 4]}
      bg="gray.900"
    >
      <Flex justify="space-between" align="center">
        <IconButton
          aria-label="Open navigation drawer"
          icon={<HamburgerIcon />}
          onClick={handleDrawerOpen}
        />

        <Flex gap={2}>
          <Button variant="outline">Check Answers</Button>
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
            <Button variant="solid" colorScheme="green" px={8} mr={4}>
              Finish
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
              {map(modules, (module) => (
                <Link
                  key={module.id}
                  display="block"
                  href={`/courses/${module.lesson}`}
                  w="full"
                  py={2}
                  px={4}
                  _hover={{ textDecor: "none", bg: "gray.600" }}
                >
                  {module.title}
                </Link>
              ))}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default BottomNavbar;
