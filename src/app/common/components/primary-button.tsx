import { Button, ChakraProps } from "@chakra-ui/react";

type PrimaryButtonProps = React.PropsWithChildren<ChakraProps> & {
  as?: React.ElementType;
  href?: string;
  onClick?: () => void;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button
      colorScheme="green"
      color="gray.800"
      border="2px solid"
      borderColor="green.400"
      shadow={"6px 6px 0 black"}
      {...props}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
