import type { AppProps } from "next/app";
import React from 'react'
import { IdProvider } from "@radix-ui/react-id";
import { globalStyles } from "stitches.config";
import { RecoilRoot } from 'recoil'
// import { LazyMotion } from "framer-motion"
import { ThemeProvider } from 'next-themes'
import { darkThemePlain, lightTheme, lightThemeBlue, darkTheme } from 'stitches.config'
import { UserProvider } from 'contexts/user'

// const loadFeatures = () =>
//   import("src/animation-features").then(res => res.default)

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();
  return (
    <RecoilRoot>
      {/* <LazyMotion features={loadFeatures} strict> */}
      <UserProvider>
        <ThemeProvider
          disableTransitionOnChange
          attribute="class"
          themes={['light-cream', 'dark-plain', 'light-blue', 'dark-blue']}
          defaultTheme="dark-blue"
          value={{
            'dark-blue': darkTheme.className,
            'light-cream': lightTheme.className,
            'dark-plain': darkThemePlain.className,
            'light-blue': lightThemeBlue.className,
          }}
        >
          <IdProvider>
            <Component {...pageProps} />
          </IdProvider>
        </ThemeProvider>
      </UserProvider>
      {/* </LazyMotion> */}
    </RecoilRoot>
  );
}

export default MyApp;