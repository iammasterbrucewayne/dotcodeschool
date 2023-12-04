import { useRef, useState } from "react";
import {
  Box,
  ChakraProps,
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
} from "@chakra-ui/react";
import { map, startsWith } from "lodash";

const COMMANDS = {
  ECHO: "echo",
  HELP: "help",
  HINT: "hint",
  CLEAR: "clear",
  SUCCESS: "mkdir rust-state-machine",
};

const TerminalEmulator = ({ ...props }: ChakraProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<{ command: string; output: string }[]>(
    []
  );

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const commandTrimmed = command.trim();

    switch (commandTrimmed) {
      case COMMANDS.HELP:
        setHistory((history) => [
          ...history,
          {
            command,
            output:
              "Welcome to the Rust State Machine course! Enter the correct command to claim your victory! If you're feeling stuck, try the 'hint' command.",
          },
        ]);
        break;
      case COMMANDS.HINT:
        setHistory((history) => [
          ...history,
          {
            command,
            output: "Hint: Try 'mkdir rust-state-machine'",
          },
        ]);
        break;
      case COMMANDS.CLEAR:
        setHistory([]);
        break;
      case COMMANDS.SUCCESS:
        setHistory((history) => [
          ...history,
          {
            command,
            output:
              "Success! You've created a directory called rust-state-machine",
          },
        ]);
        break;
      default:
        startsWith(commandTrimmed, COMMANDS.ECHO)
          ? setHistory((history) => [
              ...history,
              {
                command,
                output: command.replace(COMMANDS.ECHO, ""),
              },
            ])
          : setHistory((history) => [
              ...history,
              {
                command,
                output: `command not found: '${commandTrimmed}'... Try 'help' for a list of available commands`,
              },
            ]);
        break;
    }

    setCommand("");
  };

  return (
    <Box
      cursor="text"
      bg="gray.900"
      p={4}
      rounded={8}
      fontFamily="monospace"
      fontSize="md"
      onClick={() => inputRef.current?.focus()}
      {...props}
    >
      <Box>
        {map(history, ({ command, output }, i) => (
          <Box py={2} key={i}>
            <Text>$ {command}</Text>
            <Text
              color={
                command.trim() === COMMANDS.SUCCESS
                  ? "green.300"
                  : command.trim() === COMMANDS.HINT
                  ? "orange"
                  : "white"
              }
            >
              {output}
            </Text>
          </Box>
        ))}
      </Box>
      <form onSubmit={handleCommandSubmit}>
        <FormControl>
          <InputGroup fontFamily="monospace">
            <InputLeftAddon
              children="$"
              bg="transparent"
              border="none"
              px={0}
            />
            <Input
              ref={inputRef}
              type="text"
              value={command}
              autoComplete="off"
              border="none"
              pl={2}
              onChange={(e) => setCommand(e.target.value)}
              _focusVisible={{ outline: "none" }}
            />
          </InputGroup>
        </FormControl>
      </form>
    </Box>
  );
};

export default TerminalEmulator;
