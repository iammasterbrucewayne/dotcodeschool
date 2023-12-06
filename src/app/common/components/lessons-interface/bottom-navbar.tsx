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
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { useState } from "react";
import { map } from "lodash";

const BottomNavbar = () => {
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
          <Button variant="ghost" gap={2}>
            <ChevronLeftIcon fontSize={24} />
            <Text display={["none", "block"]}>Back</Text>
          </Button>
          <Button variant="ghost" gap={2}>
            <Text display={["none", "block"]}>Next</Text>
            <ChevronRightIcon fontSize={24} />
          </Button>
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
            <DrawerBody>
              {/* list of lessons */}
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default BottomNavbar;
