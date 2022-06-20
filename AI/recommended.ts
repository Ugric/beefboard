import { faker } from "@faker-js/faker";
import { FileProp, postProps } from "../components/post";
import { adsenseProps } from "../components/posts";
import { fork } from "child_process";
import BlastAI, { node } from "./BLASTAI";
import { db } from "../database/database";
import { readFile } from "fs/promises";
import { getFileData } from "../database/file";

if (typeof window !== "undefined") {
  while (true) {
    console.log("GET recommended.ts OFF THE CLIENT SIDE!");
  }
}

const runAI = false;

type message = {
  type: "update";
  nodes: node[];
};

const AI = new BlastAI(1, 1);
(async () => {
  const {
    nodes,
  }: {
    nodes: node[];
  } = JSON.parse(await readFile("./AI/Beefboard-AI.json", "utf8"));
  AI.nodes = nodes;
})();

if (process.env.NODE_ENV === "production" && runAI) {
  const forked = fork("./AI/AIProcess.ts", {
    execArgv: ["./node_modules/ts-node/dist/bin.js"],
  });
  forked.on("message", (msg: message) => {
    if (msg.type === "update") {
      AI.nodes = msg.nodes;
    }
  });
  forked.send({
    type: "start",
    questions: [
      {
        input: [1],
        output: [0],
      },
      {
        input: [2],
        output: [1],
      },
      {
        input: [3],
        output: [1],
      },
      {
        input: [4],
        output: [2],
      },
    ],
  });
}

type postcontent = string | FileProp;

async function recommended(UUID: string) {
  await db.up();
  const posts: {
    UUID: string;
    title: string;
    postID: string;
    time: number;
  }[] = await db.db!.all("SELECT * FROM posts ORDER BY RANDOM() LIMIT 25");
  const chosenPosts: (postProps | adsenseProps)[] = [];
  for (const post of posts) {
    const postContent: {
      type: string;
      postID: string;
      contenttype: string;
      content: string;
      alt: string;
    }[] = await db.db!.all(
      "SELECT * FROM postcontent WHERE postID = ? ORDER BY setorder ASC",
      post.postID
    );
    const content: postcontent[] = await Promise.all(
      postContent.map(async (content) =>
        content.type === "text"
          ? content.content
          : await (async () => {
              const file = await getFileData(content.content);
              if (file) {
                return {
                  id: content.content,
                  alt: content.alt,
                  type: (file.contentType.includes("image")
                    ? "image"
                    : file.contentType.includes("video")
                    ? "video"
                    : file.contentType.includes("audio")
                    ? "audio"
                    : "file") as "image" | "video" | "audio" | "file",
                };
              } else {
                return {
                  id: content.content,
                  alt: "attached file",
                  type: "file",
                };
              }
            })()
      )
    );
    let vote = 0;
    let votedata = await db.db!.all(
      "SELECT vote, UUID FROM postvotes WHERE postID = ?",
      post.postID
    );
    let votes: number = 0;
    const voteObj: {
      [key: string]: number;
    } = {};
    if (votedata.length === 0) {
      votes = 0;
    } else {
      for (const votedat of votedata) {
        if (votedat.UUID === UUID) {
          vote = votedat.vote;
        } else {
          voteObj[String(votedat.UUID)] = Number(votedat.vote);
        }
      }
    }

    for (const key of Object.keys(voteObj)) {
      votes += voteObj[key];
    }
    chosenPosts.push({
      title: post.title,
      UUID: post.UUID,
      id: post.postID,
      time: post.time,
      content,
      votes,
      voted: Number(vote) as 1 | 0 | -1,
    });
  }

  const putads: number[] = [];
  for (let i = 0; i < chosenPosts.length; i++) {
    if (Math.random() < 0.25) {
      putads.push(i);
    }
  }
  for (let i = 0; i < putads.length; i++) {
    chosenPosts.splice(putads[i] + i, 0, {
      type: "adsense",
      adID: Math.random(),
    });
  }
  return chosenPosts;
}

export default recommended;
