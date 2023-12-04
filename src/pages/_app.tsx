import theme from "@/app/common/theme";
import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from "@chakra-ui/react";
import { NextPageContext } from "next";
import { AppProps } from "next/app";

interface CustomAppProps extends AppProps {
  cookies: string;
}

export default function App({ Component, pageProps, cookies }: CustomAppProps) {
  return (
    <ChakraProvider
      theme={theme}
      colorModeManager={
        typeof cookies === "string"
          ? cookieStorageManagerSSR(cookies)
          : localStorageManager
      }
    >
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

App.getInitialProps = ({ req }: NextPageContext) => {
  return {
    cookies: req?.headers.cookie ?? "",
  };
};
