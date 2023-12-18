import theme from "@/app/common/theme";
import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from "@chakra-ui/react";
import { NextPageContext } from "next";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";

interface CustomAppProps extends AppProps {
  cookies: string;
  session: any;
}

export default function App({
  Component,
  cookies,
  session,
  pageProps,
}: CustomAppProps) {
  return (
    <ChakraProvider
      theme={theme}
      colorModeManager={
        typeof cookies === "string"
          ? cookieStorageManagerSSR(cookies)
          : localStorageManager
      }
    >
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ChakraProvider>
  );
}

App.getInitialProps = ({ req }: NextPageContext) => {
  return {
    cookies: req?.headers.cookie ?? "",
  };
};
