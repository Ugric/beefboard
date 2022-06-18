import "../styles/globals.css";
import type { AppProps } from "next/app";
import "../styles/colour-palette.css";
import Head from "next/head";
import Navbar from "../components/navbar";
import Script from "next/script";
import LogRocket from "logrocket";
import TopScreenProcessing from "../components/TopScreenProcessing";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { RecaptchaProvider } from "../components/recaptcha_client";
import axios from "axios";

if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  LogRocket.init("beefboard/beefboard");
}

const totalContext = createContext({
  setProgress: (_progress: number, _importance: number) => {},
  CurrentImportance: {
    current: 0,
  },
  currentProgress: {
    current: 0,
  },
  noAnimation: (_importance: number) => {},
});

function MyApp({ Component, pageProps }: AppProps) {
  const [progress, setProgressNum] = useState(0)
  const currentProgress = useRef(0)
  useEffect(() => {
    currentProgress.current = progress
  }, [progress])
  const [progresskey, setprogresskey] = useState(0)
  const noAnimation = useCallback((importance: number) => {
    if (importance >= currentImportance.current) {
      currentImportance.current = importance;
      setprogresskey((progresskey) => progresskey + 1);
    }
  }, []);
  const currentImportance = useRef(0)
  useEffect(() => {
    const animation = setInterval(() => setProgressNum(progress=>progress+((1-progress)/2)), 0);
    const load = () => {
      setProgressNum(1)
      window.removeEventListener("load", load);
      clearInterval(animation);
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
            noAnimation(importance)
            setProgress(0, importance)
          }, 1000);
        }
      }
    }, [])

  return (
    <>
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
        <meta
          name="google-site-verification"
          content="LR10LkgxoTHwKa2T95YeKrT2R9f1bJbEDLvhpLG6eCM"
        />
      </Head>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6522065990038784"
      ></Script>
      <TopScreenProcessing progress={progress} key={progresskey} />
      <Navbar></Navbar>
      <RecaptchaProvider site_key="6LcAbWEgAAAAAA3bHKz5gTM7fS1oQtfMHKlQst8r">
        <totalContext.Provider
          value={{
            setProgress,
            CurrentImportance: currentImportance,
            noAnimation,
            currentProgress,
          }}
        >
          <Component {...pageProps} />
        </totalContext.Provider>
      </RecaptchaProvider>
    </>
  );
}

export default MyApp;
export {
  totalContext,
}