"use client";

import {
  Box,
  Flex,
  Spacer,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Link,
  HStack,
  VStack,
  Text,
  ChakraProps,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { map } from "lodash";
import PrimaryButton from "./primary-button";
import { signIn, signOut, useSession } from "next-auth/react";

interface NavLink {
  name: string;
  href: string;
}

const NavLinks = ({ navLinks }: { navLinks: NavLink[] }) => {
  return map(navLinks, (link) => (
    <Link
      key={link.name}
      px={6}
      py={2}
      w="full"
      _hover={{ textDecoration: "none", bg: "gray.700" }}
    >
      {link.name}
    </Link>
  ));
};

const StartCourseButton = ({ ...props }: ChakraProps) => {
  return (
    <PrimaryButton
      as={Link}
      href="/courses/rust-state-machine"
      _hover={{ textDecor: "none" }}
      {...props}
    >
      Start Course
    </PrimaryButton>
  );
};

const Auth = ({ ...props }: ChakraProps) => {
  const { data: session } = useSession();
  return session ? (
    <Menu>
      <MenuButton as={Button} variant="unstyled" {...props}>
        <HStack>
          <Avatar
            name={session.user?.name || undefined}
            src={session.user?.image || undefined}
            size="sm"
          />
        </HStack>
      </MenuButton>
      <MenuList>
        <VStack spacing={0} align="start" px={4} pt={2} pb={4}>
          <Text fontWeight="semibold">{session.user?.name}</Text>
          <Text fontSize="sm" fontWeight="normal" color="gray.400">
            {session.user?.email}
          </Text>
        </VStack>
        <hr />
        <MenuItem onClick={() => signOut()}>Logout</MenuItem>
      </MenuList>
    </Menu>
  ) : (
    <Button variant="ghost" onClick={() => signIn()} {...props}>
      Login
    </Button>
  );
};

const DrawerMenu = ({
  navLinks,
  cta,
  isOpen,
  onClose,
}: {
  navLinks: NavLink[];
  cta: boolean;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Drawer placement="top" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent bg="gray.800" color="white">
        <DrawerCloseButton />
        <DrawerHeader>dotcodeschool</DrawerHeader>
        <DrawerBody px={0}>
          <VStack align="start" spacing={0}>
            {navLinks && <NavLinks navLinks={navLinks} />}
            <Auth />
            {cta && (
              <Box p={6} w="full">
                <StartCourseButton w="full" />
              </Box>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const Navbar = ({
  navLinks = [],
  cta = true,
}: {
  navLinks?: NavLink[];
  cta?: boolean;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      align="center"
      justify="space-between"
      py={4}
      bg="gray.800"
      color="white"
    >
      <Box as={Link} href="/" _hover={{ textDecor: "none" }}>
        <Text fontFamily="monospace" fontSize="lg" fontWeight="semibold">
          dotcodeschool
        </Text>
      </Box>
      <Spacer />
      <HStack display={{ base: "none", md: "block" }} spacing={4}>
        {navLinks && <NavLinks navLinks={navLinks} />}
        {cta ? <StartCourseButton /> : <Auth ml={4} />}
      </HStack>
      <IconButton
        aria-label="Toggle navigation"
        icon={<HamburgerIcon />}
        display={{ base: "block", md: "none" }}
        onClick={isOpen ? onClose : onOpen}
        bg="transparent"
        color="white"
        _hover={{ bg: "transparent" }}
        _active={{ bg: "transparent" }}
      />
      <DrawerMenu
        isOpen={isOpen}
        onClose={onClose}
        navLinks={navLinks}
        cta={cta}
      />
    </Flex>
  );
};

export default Navbar;
