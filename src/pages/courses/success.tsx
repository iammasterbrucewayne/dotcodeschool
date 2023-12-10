import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import Lottie from "react-lottie";
import { FaTwitter, FaDiscord } from "react-icons/fa";
import successAnimation from "@/../public/static/successAnimation.json";
import Navbar from "@/app/common/components/navbar";

const SuccessPage: React.FC = () => {
  const tweetText = encodeURIComponent(
    "I just completed the Rust State Machine course on https://dotcodeschool.vercel.app.\n\nNow, I am one step closer to building my own blockchain on @Polkadot."
  );
  const lottieContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [textOpacity, setTextOpacity] = useState(0);

  useEffect(() => {
    const audio = new Audio("/static/successSound.mp3");
    audio.oncanplaythrough = () => {
      if (lottieContainerRef.current) {
        lottieContainerRef.current.style.opacity = "1";
      }
      audio.play();
    };
    setTimeout(() => {
      setTextOpacity(1);
    }, 1500);
  }, []);

  return (
    <Box textAlign="center" px={[6, 12]} pb={24}>
      <Navbar cta={false} />
      <VStack maxW="4xl" mx="auto" mt={[0, 12]}>
        <Box opacity={0} ref={lottieContainerRef} transition="opacity 6s">
          <Lottie
            options={{
              animationData: successAnimation,
            }}
            height={400}
            isClickToPauseDisabled={true}
            style={{ cursor: "default" }}
          />
        </Box>
        <Text
          opacity={textOpacity}
          fontFamily="fantasy"
          fontSize="2xl"
          fontWeight="900"
          mt={-8}
          transition="opacity 2s"
        >
          Level 1: Apprentice of the Rusty State
        </Text>
        {/* <Heading
          as="h1"
          size="2xl"
          fontFamily="fantasy"
          fontWeight="black"
          my={4}
        >
          Congratulations! You have successfully completed the Rust State
          Machine course.
        </Heading> */}
        <Text
          fontSize="lg"
          opacity={textOpacity}
          transition="opacity 1s"
          transitionDelay="0.5s"
          maxW="lg"
        >
          Congratulations! You have successfully completed the Rust State
          Machine course. You're officially one step closer to building your own
          blockchain on Polkadot.
        </Text>
        <VStack
          opacity={textOpacity}
          transition="opacity 0.5s"
          transitionDelay="4s"
          mt={8}
        >
          <Button
            as={Link}
            href={`https://twitter.com/intent/tweet?text=${tweetText}`}
            bg="white"
            color="gray.800"
            size="lg"
            mb={4}
            isExternal
            _hover={{
              bg: "gray.200",
              textDecoration: "none",
            }}
          >
            Share Achievement on Twitter
          </Button>
          <ButtonGroup spacing={4}>
            <IconButton
              as={Link}
              href="https://twitter.com/Polkadot"
              aria-label="Tweet your achievement"
              colorScheme="twitter"
              variant="outline"
              size="lg"
              opacity={textOpacity}
              transition="opacity 0.5s"
              transitionDelay="4s"
              isExternal
            >
              <FaTwitter />
            </IconButton>
            <IconButton
              as={Link}
              href="https://dot.li/discord"
              aria-label="Join us on Discord"
              colorScheme="purple"
              variant="outline"
              size="lg"
              isExternal
            >
              <FaDiscord />
            </IconButton>
          </ButtonGroup>
          <Text fontStyle="italic" fontSize="sm" mt={8} mb={2} color="gray.400">
            We have more content coming soon... Stay tuned!
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default SuccessPage;
