import type { NextPage } from "next";
import Head from "next/head";
import Posts, { adsenseProps } from "../components/posts";
import example from "../static-images/example.jpeg";
import {  useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { postProps } from "../components/post";
import LogRocket from "logrocket";
import recommended from "../AI/recommended";

if (typeof window !== "undefined") {
  LogRocket.init("beefboard/beefboard");
}

const Home: NextPage<{ initposts: postProps[] }> = ({ initposts }) => {
  const [posts, setPosts] = useState<
    (
      | postProps
      | adsenseProps
    )[]
    >(initposts);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);
  return (
    <>
      <Head>
        <title>BeefBoard</title>
      </Head>
      <Posts
        posts={posts}
        hasMore={hasMore}
        next={async () => {
          const data = await fetch('/api/recommended')
          const newposts = await data.json()
          setPosts([...posts, ...newposts]);
        }}
      />
    </>
  );
};

export function getServerSideProps() {
  return {
    props: {
      initposts: recommended(),
    },
  };
}

export default Home;
