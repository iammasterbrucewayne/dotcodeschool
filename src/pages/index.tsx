import Navbar from "@/app/common/components/navbar";
import { Fragment } from "react";
import { Box, Heading, Text, Button, Link } from "@chakra-ui/react";
import PrimaryButton from "@/app/common/components/primary-button";

export default function Index() {
  return (
    <Fragment>
      <Navbar />
      <Box mt={20} maxW="6xl" mx="auto" px={[4, 12]}>
        <Heading as="h1" fontWeight="800" size="4xl" maxW="3xl">
          Learn to Code Web3 Apps by Building Real Projects.
        </Heading>
        <Text mt={4} fontSize="xl" maxW="3xl">
          Dot Code School is an interactive online school that teaches you how
          to build meaningful web3 applications using the Polkadot SDK. Learn
          how to build your own custom blockchain from zero to one hundred.
        </Text>
        <PrimaryButton
          as={Link}
          href="/courses"
          mt={12}
          py={8}
          px={16}
          _hover={{ textDecor: "none" }}
        >
          Get Started
        </PrimaryButton>
      </Box>
    </Fragment>
  );
}
