import styles from "../styles/posts.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRecaptcha } from "./recaptcha_client";

type FileProp = {
  id: string;
  alt: string;
  type: "image" | "video" | "audio" | "file";
};

type postProps = {
  type?: undefined;
  UUID: string;
  title: string;
  content: (string | FileProp)[];
  votes: number;
  time: number;
  voted: 1 | 0 | -1;
  id: string;
};

function formatNumber(n: number): string {
  let num = n;
  let number = num;
  if (number !== number) {
    number = 0;
    num = 0;
  }
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
  const [oldVote, setOldVote] = useState(post.voted);
  const [showmore, setShowMore] = useState(false);
  const [needstoshowmore, setneedsToShowMore] = useState<null | boolean>(null);
  const contentref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentref.current) {
      const outputsize = () => {
        if (contentref.current && contentref.current.offsetHeight >= 750) {
          setneedsToShowMore(true);
        } else {
          setneedsToShowMore(false);
        }
      };
      new ResizeObserver(outputsize).observe(contentref.current);
    }
  }, []);
  const maketoken = useRecaptcha();
  useEffect(() => {
    if (vote != oldVote) {
      setOldVote(vote);
      (async () => {
        const formData = new FormData();
        formData.append("id", post.id);
        formData.append("vote", JSON.stringify(vote));
        formData.append("recaptcha", await maketoken());
        const resp = await axios.post("/api/vote", formData).catch(() => {
          setVote(0);
          setOldVote(0);
          return {
            status: 400,
          };
        });
        if (resp.status === 200) {
          return;
        }

        setVote(0);
        setOldVote(0);
      })();
    }
  }, [vote]);

  const divref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (postRef) {
      postRef.current = divref.current;
    }
  }, [divref.current, divref, postRef?.current, postRef]);

  return (
    <div className={styles.post_outer_container} ref={divref}>
      <div className={styles.post + " post"} id={"post-" + post.id}>
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
                return content.type == "image" ? (
                  <img
                    src={
                      "/api/file?" +
                      new URLSearchParams({
                        id: content.id,
                      })
                    }
                    alt={content.alt||"image"}
                    className={styles.file}
                    key={index}
                  />
                ) : content.type == "video" ? (
                  <video
                    src={
                      "/api/file?" +
                      new URLSearchParams({
                        id: content.id,
                      })
                    }
                    className={styles.file}
                    controls
                    key={index}
                  />
                ) : content.type == "audio" ? (
                  <audio
                    src={
                      "/api/file?" +
                      new URLSearchParams({
                        id: content.id,
                      })
                    }
                    className={styles.file}
                    controls
                    key={index}
                  />
                ) : (
                  <a
                    href={
                      "/api/file?" +
                      new URLSearchParams({
                        id: content.id,
                      })
                    }
                    key={index}
                  >
                    {content.alt||"Attached File"}
                  </a>
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
export type { postProps, FileProp };
