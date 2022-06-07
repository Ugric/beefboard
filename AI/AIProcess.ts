import { readFileSync, writeFileSync } from "fs";
import BlastAI, { node, question } from "./BLASTAI";

type message =
  | {
      type: "start";
      questions: question[];
    }
  | {
      type: "update";
      questions: question[];
    };
let AI: BlastAI;
const snooze = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

process.on("message", (msg: message) => {
  if (msg.type === "start") {
    console.log('STARTING machine learning');
    AI = new BlastAI(1, 1);
    const { nodes, oldnodes }: {
      nodes: node[];
      oldnodes: node[];
    } = JSON.parse(readFileSync('./AI/Beefboard-AI.json', 'utf8'));
    AI.nodes = nodes;
    AI.oldnodes = oldnodes;
    AI.questions = msg.questions;
    (async () => {
      while (true) {
        AI.exam(10000);
        writeFileSync(
          "./AI/Beefboard-AI.json",
          JSON.stringify({
            nodes: AI.nodes,
            oldnodes: AI.oldnodes,
          })
        );
        process.send?.({
          type: "update",
          nodes: AI.nodes,
        });
        await snooze(0);
      }
    })();
  } else if (msg.type === "update") {
    AI.questions = msg.questions;
  } else {
    console.error("Unknown message: ", msg);
  }
});
