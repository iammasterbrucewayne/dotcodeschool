import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { Box, Heading, Text, Link, Code, IconButton } from "@chakra-ui/react";
import { Highlight, themes } from "prism-react-renderer";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { Key, useEffect, useState } from "react";

const PreComponent = (props: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const code = props.children.props.children.trim();

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  return (
    <Box
      position="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Highlight
        theme={themes.dracula}
        code={code}
        language={
          props.children.props.className
            ? props.children.props.className.replace("language-", "")
            : "rust"
        }
      >
        {({
          className,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }: {
          className: string;
          style: object;
          tokens: any[];
          getLineProps: Function;
          getTokenProps: Function;
        }) => (
          <Box
            as="pre"
            style={style}
            overflowX="auto"
            py={4}
            px={6}
            rounded={8}
            sx={{
              "::-webkit-scrollbar": {
                height: "6px",
                borderRadius: "8px",
              },
              "::-webkit-scrollbar-thumb": {
                height: "6px",
                borderRadius: "8px",
              },
              ":hover::-webkit-scrollbar-thumb": { background: "gray.700" },
            }}
          >
            <Box pr={12}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token: any, key: Key | null | undefined) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </Box>
          </Box>
        )}
      </Highlight>
      {(isHovered || copySuccess) && (
        <CopyToClipboard text={code} onCopy={() => setCopySuccess(true)}>
          <IconButton
            as={copySuccess ? CheckIcon : CopyIcon}
            aria-label="Copy code to clipboard"
            position="absolute"
            top={3}
            right={3}
            size="sm"
            p={2}
            color={copySuccess ? "green.200" : "gray.400"}
            cursor={copySuccess ? "default" : "pointer"}
            _hover={{ color: "gray.200", bg: "gray.600" }}
          />
        </CopyToClipboard>
      )}
    </Box>
  );
};

const MDXComponents = {
  h1: (props: any) => <Heading as="h1" size="xl" {...props} />,
  h2: (props: any) => <Heading as="h2" size="lg" {...props} />,
  h3: (props: any) => <Heading as="h3" size="md" {...props} />,
  p: (props: any) => <Text my={4} {...props} />,
  a: (props: any) => <Link color="green.300" {...props} />,
  ul: (props: any) => <Box as="ul" pt={2} pl={4} ml={2} {...props} />,
  ol: (props: any) => <Box as="ol" pt={2} pl={4} ml={2} {...props} />,
  li: (props: any) => <Box as="li" pb={4} {...props} />,

  code: (props: any) => (
    <Code colorScheme="orange" variant="subtle" {...props} />
  ),

  pre: (props: any) => <PreComponent {...props} />,

  blockquote: (props: any) => (
    <Box
      as="blockquote"
      borderLeft="4px solid"
      borderColor="green.500"
      background="gray.700"
      pl={4}
      py={1}
      my={4}
      {...props}
    />
  ),
};

export default MDXComponents;
