import { faker } from "@faker-js/faker";
import { postProps } from "../components/post";
import { adsenseProps } from "../components/posts";
import { fork } from "child_process";
import BlastAI, { node } from "./BLASTAI";
import { readFileSync } from "fs";
import { readFile } from "fs/promises";

if (typeof window !== "undefined") {
  while (true) {
    console.log("GET recommended.ts OFF THE CLIENT SIDE!");
  }
}

const runAI = false

const forked = fork("./AI/AIProcess.ts", {
  execArgv: ["./node_modules/ts-node/dist/bin.js"],
});

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

forked.on("message", (msg: message) => {
  if (msg.type === "update") {
    AI.nodes = msg.nodes;
  }
});

if (process.env.NODE_ENV === "production" && runAI) {
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
function recommended(): (postProps | adsenseProps)[] {
  const chosenPosts: (postProps | adsenseProps)[] = Array.from(
    { length: 10 },
    () => ({
      title: faker.lorem.sentence(),
      content: [faker.lorem.paragraph(100)],
      votes: Math.round(Math.random() * 1000000),
      voted: 0,
      id: faker.random.alphaNumeric(100),
      time: new Date(faker.date.past()).getTime(),
    })
  );
  const putads: number[] = [];
  for (let i = 0; i < chosenPosts.length; i++) {
    if (Math.random() < 0.1) {
      putads.push(i);
    }
  }
  for (let i = 0; i < putads.length; i++) {
    chosenPosts.splice(putads[i] + i, 0, {
      type: "adsense",
    });
  }
  return chosenPosts;
}

export default recommended;
