import type { AppProps } from "next/app";
import React from 'react'
import { IdProvider } from "@radix-ui/react-id";
import { globalStyles } from "stitches.config";
import {RecoilRoot} from 'recoil'
import { LazyMotion } from "framer-motion"
import {ThemeProvider} from 'next-themes'
import {darkTheme, darkThemePlain, lightThemePlain, lightThemeBlue} from 'stitches.config'
import {useState, useContext} from 'react'
// import dynamic from 'next/dynamic'
const loadFeatures = () =>
  import("src/animation-features").then(res => res.default)



const CustomTheme = React.createContext<any>(null);
const CustomThemeProvider = CustomTheme.Provider
export const CustomThemeConsumer= CustomTheme.Consumer

export const useStore = () => {
  const context = useContext(CustomTheme);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

const initialState = {
  theme: darkTheme,
  name: null
}



function MyApp({ Component, pageProps }: AppProps) {

  const [theme, changeTheme] = useState(initialState)

  globalStyles();

 

  return (
      <RecoilRoot>
         <LazyMotion features={loadFeatures} strict>
          <IdProvider>
            <CustomThemeProvider value={{theme, changeTheme}}>
              <CustomThemeConsumer>
                {value => {
                let values = { 
                    'dark-blue': darkTheme.className,
                    'light-cream':"light",
                   'light-plain':lightThemePlain.className,
                    'dark-plain':darkThemePlain.className,
                    'light-blue':lightThemeBlue.className,
                  }
                if(value.theme.theme) {
                  values = {
                    'dark-blue': darkTheme.className,
                    'light-cream':"light",
                     'light-plain':lightThemePlain.className,
                     'dark-plain':darkThemePlain.className,
                       'light-blue':lightThemeBlue.className,
                    // [value.theme.name]:value.theme.theme.className
                  }
                } else {
                  values = {
                    'dark-blue': darkTheme.className,
                    'light-cream':"light",
                     'light-plain':lightThemePlain.className,
                    'dark-plain':darkThemePlain.className,
                    'light-blue':lightThemeBlue.className,
                  }
                }
                return(
                  <ThemeProvider
                    disableTransitionOnChange
                    attribute="class"
                    defaultTheme="light-cream"
                    themes={['light-cream', 'dark-plain', 'light-blue', 'dark-blue']}
                    // defaultTheme="custom-theme"
                    value={values}
                  > 
                      <Component {...pageProps} />
                  </ThemeProvider>
                  )}
                }
        
              </CustomThemeConsumer>
            </CustomThemeProvider>
          </IdProvider>
        </LazyMotion>
      </RecoilRoot>
  );
}



export default MyApp;