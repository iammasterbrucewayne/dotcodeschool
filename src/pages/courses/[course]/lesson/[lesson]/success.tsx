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
import { FaTwitter, FaDiscord, FaArrowRight } from "react-icons/fa";
import successAnimation from "@/../public/static/successAnimation.json";
import Navbar from "@/app/common/components/navbar";
import { getContentByType } from "@/pages/api/get-content";
import { flatMapDeep } from "lodash";

interface SuccessPageProps {
  course: string;
  lesson: string;
}

const SuccessPage: React.FC<SuccessPageProps> = (props: SuccessPageProps) => {
  const totalLessonsInCourse = 7;
  const tweetText = encodeURIComponent(
    "I just completed the Rust State Machine course on https://dotcodeschool.com.\n\nNow, I am one step closer to building my own blockchain on @Polkadot."
  );

  const { course, lesson } = props;

  const lottieContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [textOpacity, setTextOpacity] = useState(0);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) {
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
    } else {
      if (lottieContainerRef.current) {
        lottieContainerRef.current.style.opacity = "1";
      }
      setTextOpacity(1);
    }
  }, []);

  return (
    <Box textAlign="center" px={[6, 12]} pb={24}>
      <Navbar cta={false} />
      <VStack maxW="4xl" mx="auto" mt={[-10, 12]}>
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
          Level {lesson}: Apprentice of the Rusty State
        </Text>
        <Text
          fontSize="lg"
          opacity={textOpacity}
          transition="opacity 1s"
          transitionDelay="0.5s"
          maxW="lg"
        >
          Congratulations! You have successfully completed the Rust State
          Machine course. You&apos;re officially one step closer to building
          your own blockchain on Polkadot.
        </Text>
        <VStack
          opacity={textOpacity}
          transition="opacity 0.5s"
          transitionDelay="4s"
          mt={8}
        >
          <VStack spacing={4} mb={8}>
            {Number(lesson) < totalLessonsInCourse ? (
              <Button
                as={Link}
                href={`/courses/${course}/lesson/${lesson}/chapter/1`}
                rightIcon={<FaArrowRight />}
                bg="white"
                color="gray.800"
                w="full"
                size="lg"
                _hover={{
                  bg: "gray.200",
                  textDecoration: "none",
                }}
              >
                Next Lesson
              </Button>
            ) : (
              <Button
                as={Link}
                leftIcon={<FaTwitter />}
                href={`https://twitter.com/intent/tweet?text=${tweetText}`}
                bg="white"
                color="gray.800"
                w="full"
                size="lg"
                _hover={{
                  bg: "gray.200",
                  textDecoration: "none",
                }}
                px={12}
                isExternal
              >
                Tweet Your Achievement
              </Button>
            )}
          </VStack>
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

export function getStaticProps({ params }: any) {
  return {
    props: params,
  };
}

export async function getStaticPaths() {
  const res = await getContentByType("courseModule");
  const paths = res.items.map((item: any) => {
    const { slug, sections } = item.fields;
    return sections.map((section: any, index: number) => {
      const result = {
        params: {
          course: slug,
          lesson: `${index + 1}`,
        },
      };
      return result;
    });
  });

  const flattenedPaths = flatMapDeep(paths);

  return {
    paths: flattenedPaths,
    fallback: false,
  };
}
