import styles from "../styles/posts.module.css";
import Post from "./post";
import type { postProps } from "./post";
import { CSSProperties } from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";
import AdBanner from "./ads";
import { createContext, useContext, useEffect, useRef } from "react";
import { useState } from "react";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { watchtimeReqData } from "../pages/api/watchtime";
import axios from "axios";
import { useRecaptcha } from "./recaptcha_client";

type adsenseProps = {
  type: "adsense";
  id?: undefined;
  voted?: undefined;
  adID: number;
};

type watchtime = {
  id: string;
  current?: HTMLDivElement;
  totalWatchtime: number;
  startTime?: number;
};

function distanceFromCenterOfWindowHeight(elm: HTMLDivElement) {
  const rect = elm.getBoundingClientRect();
  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );
  return Math.abs(viewHeight / 3.75 - (rect.top + rect.height / 2));
}

function checkVisible(elm: HTMLDivElement) {
  var rect = elm.getBoundingClientRect();
  var viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );
  return viewHeight < rect.height || (rect.bottom >= 0 && rect.top >= 0);
}

function Posts({
  posts,
  next,
  hasMore,
  style,
}: {
  posts: (postProps | adsenseProps)[];
  next: () => void;
  hasMore: boolean;
  style?: CSSProperties;
}) {
  const currentPostScore = useRef<Record<number, watchtime>>({});
  const [_, reload] = useState(0);
  useEffect(() => {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].type !== "adsense") {
        currentPostScore.current[i] = {
          id: String(posts[i].id),
          totalWatchtime: currentPostScore.current[i]
            ? currentPostScore.current[i].totalWatchtime
            : 0,
          current: currentPostScore.current[i]?.current,
          startTime: currentPostScore.current[i]?.startTime,
        };
      }
    }
    reload((n) => n + 1);
  }, [posts]);
  useEffect(() => {
    let watchtimetotal: Record<
      string,
      {
        id: string;
        time: number;
      }
    > = {};
    const watchtimeCalculator = () => {
      const browser_active = !document.hidden;
      const currentTime = Date.now();
      if (browser_active) {
        let currentPostViewID: number | null = null;
        let distanceFromview = Infinity;
        for (const id of Object.keys(currentPostScore.current)) {
          const i: number = Number(id);
          const element = currentPostScore.current[i]?.current;
          const currentScore = currentPostScore.current[i];
          if (element) {
            if (checkVisible(element)) {
              const distance = distanceFromCenterOfWindowHeight(element);
              if (distanceFromview > distance) {
                distanceFromview = distance;
                currentPostViewID = i;
                continue;
              }
            }
            if (currentScore?.startTime) {
              const timespent = currentTime - currentScore.startTime;
              if (timespent >= 2500) {
                currentScore.totalWatchtime += timespent;
                if (watchtimetotal[i]) {
                  watchtimetotal[i].time += timespent;
                } else {
                  const postID = currentPostScore.current[i].id;
                  watchtimetotal[i] = {
                    id: postID,
                    time: timespent,
                  };
                }
              }
              currentScore.startTime = undefined;
            }
          } else {
          }
        }
        const post = currentPostScore.current[Number(currentPostViewID)];
        if (currentPostViewID && post) {
          if (!post.startTime) {
            post.startTime = Date.now();
          }
        } else {
        }
      } else {
        for (const i of Object.keys(currentPostScore.current)) {
          const id: number = Number(i);
          const currentScore = currentPostScore.current[id];
          if (currentScore.startTime) {
            const timespent = currentTime - currentScore.startTime;
            if (timespent >= 2500) {
              currentScore.totalWatchtime += timespent;
              if (watchtimetotal[id]) {
                watchtimetotal[id].time += timespent;
              } else {
                const postID = currentPostScore.current[id].id;
                watchtimetotal[id] = {
                  id: postID,
                  time: timespent,
                };
              }
            }
            currentScore.startTime = undefined;
          }
        }
      }
    };
    setTimeout(() => watchtimeCalculator(), 0);
    window.addEventListener("scroll", watchtimeCalculator);
    const checkloop = setInterval(watchtimeCalculator, 1000);
    const sendloop = setInterval(async () => {
      if (Object.keys(watchtimetotal).length > 0) {
        const formdata = new FormData();
        formdata.append("recaptcha", await maketoken());
        formdata.append("watchtime", JSON.stringify(watchtimetotal));
        axios.post("/api/watchtime", formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        watchtimetotal = {};
      }
    }, 10000);
    return () => {
      clearInterval(checkloop);
      clearInterval(sendloop);
      window.removeEventListener("scroll", watchtimeCalculator);
    };
  }, []);
  const maketoken = useRecaptcha()
  return (
    <div className={styles.post_container} style={style}>
      <InfiniteScroll
        dataLength={posts.length}
        next={next}
        hasMore={hasMore}
        loader={<></>}
      >
        {posts.map((post, index) =>
          post.type == "adsense" ? (
            <div className={styles.post_outer_container} key={"ad-" + index}>
              <div className={styles.post + " ad"}>
                <AdBanner adID={post.adID}></AdBanner>
              </div>
            </div>
          ) : (
            <Post
              post={post}
              key={index}
              postRef={currentPostScore.current[index]}
            />
          )
        )}
      </InfiniteScroll>
    </div>
  );
}

export default Posts;
export type { adsenseProps };
