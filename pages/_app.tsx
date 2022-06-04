import "../styles/globals.css";
import type { AppProps } from "next/app";
import "../styles/colour-palette.css";
import Head from "next/head";
import Navbar from "../components/navbar";
import { useState } from "react";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  const [navHeight, setNavHeight] = useState(0);
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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6522065990038784"
          crossOrigin="anonymous"
        ></Script>
      </Head>
      <Navbar setheight={setNavHeight}></Navbar>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
