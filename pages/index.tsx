import type { NextPage } from "next";
import Head from "next/head";
import Posts, { adsenseProps } from "../components/posts";
import {  useEffect, useState } from "react";
import { postProps } from "../components/post";
import LogRocket from "logrocket";
import recommended from "../AI/recommended";
import styles from "../styles/recommended.module.css";

if (typeof window !== "undefined") {
  LogRocket.init("beefboard/beefboard");
}

const Home: NextPage<{ initposts: (postProps | adsenseProps)[] }> = ({
  initposts,
}) => {
  const [posts, setPosts] = useState<(postProps | adsenseProps)[]>(initposts);
  const [hasMore, setHasMore] = useState(initposts.length!=0);
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
          const data = await fetch("/api/recommended");
          const newposts: (postProps | adsenseProps)[] = await data.json();
          setHasMore(newposts.length != 0);
          setPosts([...posts, ...newposts]);
        }}
      />
      {!hasMore ? <h1 className={
      styles.the_end
      }>{'You have found the end... well done!'}</h1> : <></>}
    </>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      initposts: await recommended('0'),
    },
  };
}

export default Home;
