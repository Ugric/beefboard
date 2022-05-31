import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/navbar";
import Posts from "../components/posts";
import styles from "../styles/Home.module.css";
import example from "../static-images/example.jpeg";
import { useCallback, useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { postProps } from "../components/post";

const Home: NextPage<{ initposts: postProps[] }> = ({ initposts }) => {
  const [posts, setPosts] = useState<postProps[]>(initposts);
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
        next={() => {
          setPosts(
            posts.concat(
              Array.from({ length: 10 }, () => ({
                title: faker.lorem.sentence(),
                content: [
                  faker.lorem.paragraph(),
                  {
                    src: example.src + "?" + Math.random(),
                    alt: "magnifying glass",
                    aspectRatio: 1.5,
                  },
                ],
                votes: Math.round(Math.random() * 1000000),
                voted: 0,
                id: faker.random.alphaNumeric(100),
              }))
            )
          );
        }}
      />
    </>
  );
};

export function getServerSideProps() {
  return {
    props: {
      initposts: Array.from({ length: 10 }, () => ({
        title: faker.lorem.sentence(),
        content: [
          faker.lorem.paragraph(),
          {
            src: example.src + "?" + Math.random(),
            alt: "magnifying glass",
            aspectRatio: 1.5,
          },
        ],
        votes: Math.round(Math.random() * 1000000),
        voted: 0,
        id: faker.random.alphaNumeric(100),
      })),
    },
  };
}

export default Home;
