import styles from "../styles/posts.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { LegacyRef, useEffect, useRef, useState } from "react";
import ResponsiveImage from "./responsiveImage";

type ImageProps = {
  src: string;
  alt: string;
  aspectRatio: number;
};

type postProps = {
  type?:undefined;
  title: string;
  content: (string | ImageProps)[];
  votes: number;
  time: number;
  voted: 1 | 0 | -1;
  id: string;
};

function formatNumber(num: number): string {
  let number = num;
  let suffix = "";
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    number = num / 1000;
    suffix = "k";
  } else if (num < 1000000000) {
    number = num / 1000000;
    suffix = "m";
  } else {
    number = num / 1000000000;
    suffix = "b";
  }
  return Number(number.toPrecision(3)) + suffix;
}

function Post({
  post,
  postRef,
}: {
  post: postProps;
  postRef?: {
    current?: HTMLDivElement | null;
    [key: string]: any;
  };
}) {
  const [vote, setVote] = useState(post.voted);
  const [showmore, setShowMore] = useState(false);
  const [needstoshowmore, setneedsToShowMore] = useState<null | boolean>(null);
  const contentref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentref.current) {
      const outputsize = () => {
        if (contentref.current && contentref.current.offsetHeight >= 250) {
          setneedsToShowMore(true);
        } else {
          setneedsToShowMore(false);
        }
      };
      new ResizeObserver(outputsize).observe(contentref.current);
    }
  }, []);

  const divref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (postRef) {
      postRef.current = divref.current;
    }
  }, [divref.current, divref, postRef?.current, postRef]);

  return (
    <div className={styles.post_outer_container} ref={divref}>
      <div className={styles.post}>
        <div className={styles.post_votes}>
          <button onClick={() => setVote(vote == 1 ? 0 : 1)}>
            <FontAwesomeIcon
              icon={faArrowUp}
              className={
                styles.vote + (vote == 1 ? " " + styles.upvote_clicked : "")
              }
            />
          </button>
          <p
            className={
              vote == 1
                ? styles.upvote_clicked
                : vote == -1
                ? styles.downvote_clicked
                : styles.novote
            }
          >
            {formatNumber(post.votes + vote)}
          </p>
          <button onClick={() => setVote(vote == -1 ? 0 : -1)}>
            <FontAwesomeIcon
              icon={faArrowDown}
              className={
                styles.vote + (vote == -1 ? " " + styles.downvote_clicked : "")
              }
            />
          </button>
        </div>
        <div className={styles.post_content}>
          <h1 className={styles.title}>{post.title}</h1>
          <div
            ref={contentref}
            className={
              !showmore && (needstoshowmore || needstoshowmore === null)
                ? styles.hide_some
                : undefined
            }
          >
            {post.content.map((content, index) => {
              if (typeof content === "string") {
                return (
                  <p className={styles.text} key={index}>
                    {content}
                  </p>
                );
              } else {
                return (
                  <ResponsiveImage
                    key={index}
                    src={content.src}
                    alt={content.alt}
                    className={styles.image}
                    aspectRatio={content.aspectRatio}
                  />
                );
              }
            })}
          </div>
          {needstoshowmore && (
            <a
              onClick={() => setShowMore(!showmore)}
              className={styles.showmore}
            >
              {showmore ? "Show Less" : "Show More"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
export type { postProps };
