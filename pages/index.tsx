import type { NextPage } from "next";
import Head from "next/head";
import Posts, { adsenseProps } from "../components/posts";
import {  useContext, useEffect, useState } from "react";
import { postProps } from "../components/post";
import recommended from "../AI/recommended";
import styles from "../styles/recommended.module.css";
import axios from "axios";
import {totalContext}from'./_app'

const Home: NextPage<{ initposts: (postProps | adsenseProps)[] }> = ({
  initposts,
}) => {
  const [posts, setPosts] = useState<(postProps | adsenseProps)[]>(initposts);
  const [hasMore, setHasMore] = useState(initposts.length!=0);
  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);
  const { CurrentImportance, setProgress, noAnimation, currentProgress } =
    useContext(totalContext);
  return (
    <>
      <Head>
        <title>BeefBoard</title>
      </Head>
      <Posts
        posts={posts}
        hasMore={hasMore}
        next={async () => {
          const importance = CurrentImportance.current + 1
          noAnimation(importance);
          setProgress(0, importance)
          const data = await axios.get(
            '/api/recommended',
          )
          const newposts: (postProps | adsenseProps)[] = data.data;
          setHasMore(newposts.length != 0);
          setPosts([...posts, ...newposts]);
          setProgress(1, importance);
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
