// import App from "next/app";
import type { AppProps /* , AppContext */ } from "next/app";
import { IdProvider } from "@radix-ui/react-id";
import { globalStyles } from "../stitches.config";
import {RecoilRoot} from 'recoil'

function MyApp({ Component, pageProps }: AppProps) {

  globalStyles();

  return (
      <RecoilRoot>
          <IdProvider>
            <Component {...pageProps} />
          </IdProvider>
      </RecoilRoot>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp;