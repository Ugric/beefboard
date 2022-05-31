import styles from "../styles/posts.module.css";
import Post from "./post";
import type { postProps } from "./post";
import { CSSProperties } from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";

function Posts({
  posts,
  next,
  hasMore,
  style,
}: {
  posts: postProps[];
  next: () => void;
  hasMore: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={styles.post_container} style={style}>
      <InfiniteScroll
        dataLength={posts.length}
        next={next}
        hasMore={hasMore}
        loader={<></>}
      >
        {posts.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default Posts;
