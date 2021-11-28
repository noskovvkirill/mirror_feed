import type { AppProps } from "next/app";
import React from 'react'
import { IdProvider } from "@radix-ui/react-id";
import { globalStyles } from "stitches.config";
import {RecoilRoot} from 'recoil'
import { LazyMotion } from "framer-motion"
import {ThemeProvider} from 'next-themes'
import {darkTheme, darkThemePlain, lightThemePlain, lightThemeBlue} from 'stitches.config'
import {useEffect} from 'react'
import {UserProvider, UserType} from 'contexts/user'

// import dynamic from 'next/dynamic'
const loadFeatures = () =>
  import("src/animation-features").then(res => res.default)







// const CustomTheme = React.createContext<any>(null);
// const CustomThemeProvider = CustomTheme.Provider
// export const CustomThemeConsumer= CustomTheme.Consumer

// export const useStore = () => {
//   const context = useContext(CustomTheme);
//   if (!context) {
//     throw new Error("useStore must be used within a StoreProvider");
//   }
//   return context;
// };

// const initialState = {
//   theme: darkTheme,
//   name: null
// }



function MyApp({ Component, pageProps }: AppProps) {

 

  // const [theme, changeTheme] = useState(initialState)

  globalStyles();

  useEffect(()=>{
      if("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js",  { type: "module" }).then(
            async function (registration) {
              console.log("Service Worker registration successful with scope: ", registration.scope);
              const status = await navigator.permissions.query({
                name: 'periodic-background-sync',
              });
              if (status.state === 'granted') {
                console.log('sw status granted')
              } else {
                  console.log('sw status NOT_granted')
              }

            },
            function (err) {
              console.log("Service Worker registration failed: ", err);
            }
          );
    }
  },[])

  
 

  return (
      <RecoilRoot>
         <LazyMotion features={loadFeatures} strict>
          <UserProvider>
  

              {/* //custom theme provider is an addition that helps to create a theme at the runtime */}
              {/* <CustomThemeProvider value={{theme, changeTheme}}> 
                <CustomThemeConsumer> */}
                  {/* {value => {
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
                  return( */}
                    <ThemeProvider
                      disableTransitionOnChange
                      attribute="class"
                      defaultTheme="light-cream"
                      themes={['light-cream', 'dark-plain', 'light-blue', 'dark-blue']}
                      // defaultTheme="custom-theme"
                      value={{
                      'dark-blue': darkTheme.className,
                      'light-cream':"light",
                      'light-plain':lightThemePlain.className,
                      'dark-plain':darkThemePlain.className,
                      'light-blue':lightThemeBlue.className,
                    }}
                    >    
                      <IdProvider>      
                          <Component {...pageProps} />
                      </IdProvider>
                    </ThemeProvider>
                    {/* )}
                  } */}
          
                {/* </CustomThemeConsumer>
              </CustomThemeProvider> */}
             
           </UserProvider>
        </LazyMotion>
      </RecoilRoot>
  );
}



export default MyApp;