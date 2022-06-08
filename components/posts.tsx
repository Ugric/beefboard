import styles from "../styles/posts.module.css";
import Post from "./post";
import type { postProps } from "./post";
import { CSSProperties } from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";
import AdBanner from "./ads";
import { useEffect, useRef } from "react";

type adsenseProps = {
  type: "adsense";
  id?: undefined;
  voted?: undefined;
  adID: number
};

type watchtime = {
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
  return Math.abs(viewHeight / 3 - (rect.top + rect.height / 2));
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
  const currentPostScore = useRef<Record<string, watchtime>>({});
  useEffect(() => {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].type !== "adsense") {
        currentPostScore.current[String(posts[i].id)] = {
          totalWatchtime: currentPostScore.current[String(posts[i].id)]
            ? currentPostScore.current[String(posts[i].id)].totalWatchtime
            : 0,
          current: currentPostScore.current[String(posts[i].id)]?.current,
          startTime: currentPostScore.current[String(posts[i].id)]?.startTime,
        };
      }
    }
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
        let currentPostViewID: string | null = null;
        let distanceFromview = Infinity;
        for (const id of Object.keys(currentPostScore.current)) {
          const element = currentPostScore.current[id].current;
          const currentScore = currentPostScore.current[id]
          if (element) {
            if (checkVisible(element)) {
              const distance = distanceFromCenterOfWindowHeight(element);
              if (distanceFromview > distance) {
                distanceFromview = distance;
                currentPostViewID = id;
                continue;
              }
            }
            if (currentScore.startTime) {
              const timespent = currentTime - currentScore.startTime;
              if (timespent >= 2500) {
                currentScore.totalWatchtime += timespent;
                if (watchtimetotal[id]) {
                  watchtimetotal[id].time += timespent;
                } else {
                  watchtimetotal[id] = {
                    id: id,
                    time: timespent,
                  };
                }
              }
              currentScore.startTime = undefined;
            }
          }
        }
        const post = currentPostScore.current[String(currentPostViewID)];
        if (currentPostViewID && post) {
          if (!post.startTime) {
            post.startTime = Date.now()
          }
        }
      } else {
        for (const id of Object.keys(currentPostScore.current)) {
          const currentScore = currentPostScore.current[id];
          if (currentScore.startTime) {
            const timespent = currentTime - currentScore.startTime;
            if (timespent >= 2500) {
              currentScore.totalWatchtime += timespent;
              if (watchtimetotal[id]) {
                watchtimetotal[id].time += timespent;
              } else {
                watchtimetotal[id] = {
                  id: id,
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
    const sendloop = setInterval(() => {
      if (Object.keys(watchtimetotal).length > 0) {
        (async () => {
          await fetch("/api/watchtime", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(watchtimetotal),
          });
        })();
        watchtimetotal = {};
      }
    }, 10000);
    return () => {
      clearInterval(checkloop);
      clearInterval(sendloop);
      window.removeEventListener("scroll", watchtimeCalculator);
    };
  }, []);
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
              <div className={styles.post}>
                <AdBanner adID={post.adID}></AdBanner>
              </div>
            </div>
          ) : (
            <Post
              post={post}
              key={index}
              postRef={currentPostScore.current[post.id]}
            />
          )
        )}
      </InfiniteScroll>
    </div>
  );
}

export default Posts;
export type { adsenseProps };
