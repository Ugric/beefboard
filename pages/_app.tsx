import "../styles/globals.css";
import type { AppProps } from "next/app";
import "../styles/colour-palette.css";
import Head from "next/head";
import Navbar from "../components/navbar";
import Script from "next/script";
import LogRocket from "logrocket";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import TopScreenProcessing from "../components/TopScreenProcessing";
import { createContext, useCallback, useEffect, useRef, useState } from "react";

if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  LogRocket.init("beefboard/beefboard");
}

const totalContext = createContext({
  setProgress: (progress: number, importance: number) => { },
  CurrentImportance: {
    current: 0,
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const [progress, setProgressNum] = useState(0)
  const currentImportance = useRef(0)
  useEffect(() => {
    const load = () => {
      setProgress(1,0);
      window.removeEventListener("load", load);
    };
    window.addEventListener('load', load)
  },[])
  const setProgress = useCallback(
    (progress: number, importance: number) => {
      if (importance >= currentImportance.current) {
        currentImportance.current = importance;
        setProgressNum(progress);
        if (progress >= 1) {
          setTimeout(() => {
            setProgress(0, importance)
          }, 1500);
        }
      }
    }, [])

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6LcAbWEgAAAAAA3bHKz5gTM7fS1oQtfMHKlQst8r"
      language="english"
    >
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff7575" />
        <meta name="msapplication-TileColor" content="#2c2c2c" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="theme-color" content="#2c2c2c" />
      </Head>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6522065990038784"
        crossOrigin="anonymous"
      ></Script>
      <TopScreenProcessing progress={progress} />
      <Navbar></Navbar>
      <totalContext.Provider
        value={{
          setProgress,
          CurrentImportance: currentImportance,
        }}
      >
        <Component {...pageProps} />
      </totalContext.Provider>
    </GoogleReCaptchaProvider>
  );
}

export default MyApp;
export {
  totalContext,
}