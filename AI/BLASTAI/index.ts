type value = {
  for: "INPUT" | "OUTPUT";
  index: number;
};

type node =
  | {
      type: "add" | "subtract" | "multiply" | "divide" | "power";
      first: value;
      second: value | number;
    }
  | {
      type: "floor" | "ceil" | "round" | "zeromin" | "abs";
      var: value;
    }
  | {
      type: "statement";
      condition: {
        type:
          | "less"
          | "lessEqual"
          | "equal"
          | "notEqual"
          | "greaterEqual"
          | "greater";
        first: value;
        second: value | number;
      };
      true: node[];
      false: node[];
    };

type question = {
  input: number[];
  output: number[];
};

class BlastAI {
  oldnodes: node[] = [];
  nodes: node[] = [];
  result: number = Infinity;
  questions: question[] = [];
  gen: number = 0;
  inputsize: number;
  outputsize: number;
  static predict: any;
  constructor(inputsize: number, outputsize: number) {
    this.inputsize = inputsize;
    this.outputsize = outputsize;

    this.oldnodes = [];
    this.nodes = [];
    this.result = Infinity;
    this.questions = [];
    this.gen = 0;
  }
  process(n: node, input: number[], output: number[]) {
    if (n.type == "add") {
      if (typeof n.second == "number") {
        if (n.first.for == "OUTPUT") {
          output[n.first.index] += n.second;
        } else {
          input[n.first.index] += n.second;
        }
      } else if (n.first.for == "OUTPUT") {
        if (n.second.for == "OUTPUT") {
          output[n.first.index] += output[n.second.index];
        } else {
          output[n.first.index] += input[n.second.index];
        }
      } else {
        if (n.second.for == "OUTPUT") {
          input[n.first.index] += output[n.second.index];
        } else {
          input[n.first.index] += input[n.second.index];
        }
      }
    } else if (n.type == "subtract") {
      if (typeof n.second == "number") {
        if (n.first.for == "OUTPUT") {
          output[n.first.index] -= n.second;
        } else {
          input[n.first.index] -= n.second;
        }
      } else if (n.first.for == "OUTPUT") {
        if (n.second.for == "OUTPUT") {
          output[n.first.index] -= output[n.second.index];
        } else {
          output[n.first.index] -= input[n.second.index];
        }
      } else {
        if (n.second.for == "OUTPUT") {
          input[n.first.index] -= output[n.second.index];
        } else {
          input[n.first.index] -= input[n.second.index];
        }
      }
    } else if (n.type == "multiply") {
      if (typeof n.second == "number") {
        if (n.first.for == "OUTPUT") {
          output[n.first.index] *= n.second;
        } else {
          input[n.first.index] *= n.second;
        }
      } else if (n.first.for == "OUTPUT") {
        if (n.second.for == "OUTPUT") {
          output[n.first.index] *= output[n.second.index];
        } else {
          output[n.first.index] *= input[n.second.index];
        }
      } else {
        if (n.second.for == "OUTPUT") {
          input[n.first.index] *= output[n.second.index];
        } else {
          input[n.first.index] *= input[n.second.index];
        }
      }
    } else if (n.type == "divide") {
      if (typeof n.second == "number") {
        if (n.first.for == "OUTPUT") {
          output[n.first.index] /= n.second;
        } else {
          input[n.first.index] /= n.second;
        }
      } else if (n.first.for == "OUTPUT") {
        if (n.second.for == "OUTPUT") {
          output[n.first.index] /= output[n.second.index];
        } else {
          output[n.first.index] /= input[n.second.index];
        }
      } else {
        if (n.second.for == "OUTPUT") {
          input[n.first.index] /= output[n.second.index];
        } else {
          input[n.first.index] /= input[n.second.index];
        }
      }
    } else if (n.type == "power") {
      if (typeof n.second == "number") {
        if (n.first.for == "OUTPUT") {
          output[n.first.index] = Math.pow(output[n.first.index], n.second);
        } else {
          input[n.first.index] = Math.pow(input[n.first.index], n.second);
        }
      } else if (n.first.for == "OUTPUT") {
        if (n.second.for == "OUTPUT") {
          output[n.first.index] = Math.pow(
            output[n.first.index],
            output[n.second.index]
          );
        } else {
          output[n.first.index] = Math.pow(
            output[n.first.index],
            input[n.second.index]
          );
        }
      } else {
        if (n.second.for == "OUTPUT") {
          input[n.first.index] = Math.pow(
            input[n.first.index],
            output[n.second.index]
          );
        } else {
          input[n.first.index] = Math.pow(
            input[n.first.index],
            input[n.second.index]
          );
        }
      }
    } else if (n.type == "floor") {
      if (n.var.for == "OUTPUT") {
        output[n.var.index] = Math.floor(output[n.var.index]);
      } else {
        input[n.var.index] = Math.floor(input[n.var.index]);
      }
    } else if (n.type == "ceil") {
      if (n.var.for == "OUTPUT") {
        output[n.var.index] = Math.ceil(output[n.var.index]);
      } else {
        input[n.var.index] = Math.ceil(input[n.var.index]);
      }
    } else if (n.type == "round") {
      if (n.var.for == "OUTPUT") {
        output[n.var.index] = Math.round(output[n.var.index]);
      } else {
        input[n.var.index] = Math.round(input[n.var.index]);
      }
    } else if (n.type == "zeromin") {
      if (n.var.for == "OUTPUT") {
        output[n.var.index] = Math.min(0, output[n.var.index]);
      } else {
        input[n.var.index] = Math.min(0, input[n.var.index]);
      }
    } else if (n.type == "abs") {
      if (n.var.for == "OUTPUT") {
        output[n.var.index] = Math.abs(output[n.var.index]);
      } else {
        input[n.var.index] = Math.abs(input[n.var.index]);
      }
    } else if (n.type == "statement") {
      const val1 =
        n.condition.first.for == "OUTPUT"
          ? output[n.condition.first.index]
          : input[n.condition.first.index];
      const val2 =
        typeof n.condition.second == "number"
          ? n.condition.second
          : n.condition.second.for == "OUTPUT"
          ? output[n.condition.second.index]
          : input[n.condition.second.index];
      if (
        (n.condition.type == "less" && val1 < val2) ||
        (n.condition.type == "lessEqual" && val1 <= val2) ||
        (n.condition.type == "equal" && val1 == val2) ||
        (n.condition.type == "greaterEqual" && val1 >= val2) ||
        (n.condition.type == "greater" && val1 > val2)
      ) {
        for (const i of n.true) {
          this.process(i, input, output);
        }
      } else {
        for (const i of n.false) {
          this.process(i, input, output);
        }
      }
    }
  }
  _predict(nodes: node[], startinput: number[]): number[] {
    const input = Array.from(startinput);
    const output: number[] = Array.from({ length: this.inputsize }, () => 0);
    for (const i of nodes) {
      this.process(i, input, output);
    }
    return output;
  }
  completelyRandom() {
    return 1 / Math.random();
  }
  predict(input: number[]): number[] {
    return this._predict(this.nodes, input);
  }
  makeRandomNode(): node {
    const choices = [
      "add",
      "subtract",
      "multiply",
      "divide",
      "power",
      "floor",
      "ceil",
      "round",
      "zeromin",
      "abs",
      "statement",
    ];
    const choice: any = choices[Math.floor(Math.random() * choices.length)];
    if (choice == "statement") {
      const type: any = [
        "less",
        "lessEqual",
        "equal",
        "notEqual",
        "greaterEqual",
        "greater",
      ][Math.floor(Math.random() * 6)];
      const first: any = {
        for: ["INPUT", "OUTPUT"][Math.floor(Math.random() * 2)],
        index: Math.floor(Math.random() * this.inputsize),
      };
      const second: any =
        Math.random() < 2 / 3
          ? {
              for: ["INPUT", "OUTPUT"][Math.floor(Math.random() * 2)],
              index: Math.floor(Math.random() * this.inputsize),
            }
          : this.completelyRandom();
      const True = this.makeClone([]);
      const False = this.makeClone([]);
      return {
        type: "statement",
        condition: {
          type: type,
          first: first,
          second: second,
        },
        true: True,
        false: False,
      };
    } else if (
      ["add", "subtract", "multiply", "divide", "power"].includes(choice)
    ) {
      const first: any = {
        for: ["INPUT", "OUTPUT"][Math.floor(Math.random() * 2)],
        index: Math.floor(Math.random() * this.inputsize),
      };
      const second: any =
        Math.random() < 2 / 3
          ? {
              for: ["INPUT", "OUTPUT"][Math.floor(Math.random() * 2)],
              index: Math.floor(Math.random() * this.inputsize),
            }
          : this.completelyRandom();
      return {
        type: choice,
        first,
        second,
      };
    } else {
      const first: any = {
        for: ["INPUT", "OUTPUT"][Math.floor(Math.random() * 2)],
        index: Math.floor(Math.random() * this.inputsize),
      };
      return {
        type: choice,
        var: first,
      };
    }
  }
  makeClone(nodes: node[]) {
    const clone = Object.assign([], nodes);
    let deleted = 0;
    if (clone.length > 0) {
      for (let i = 0; i < clone.length; i++) {
        if (0.25 >= Math.random()) {
          if (0.5 >= Math.random()) {
            clone.splice(i - deleted, 1);
            deleted++;
          }
        }
      }
    }
    const numberToAdd = Math.floor(
      Math.random() * (Math.max(this.outputsize, this.inputsize, 10) + 1)
    );
    for (let i = 0; i < numberToAdd; i++) {
      clone.push(this.makeRandomNode());
    }
    return clone;
  }
  scoreAnswer(answer: number[], markscheme: number[]) {
    let score = 0;
    for (let i = 0; i < this.outputsize; i++) {
      score += Math.abs(answer[i] - markscheme[i]);
    }
    score /= this.outputsize;
    return score;
  }
  exam(numberofbots: number) {
    const best = {
      score: Infinity,
      nodes: [],
      botID: 0,
      qAndA: [{
        input: [0],
        output: [0],
        score: 0,
      }]
    };
    for (let i = 0; i < numberofbots; i++) {
      const random = Math.random()
      const clone = this.makeClone(random<1/3?this.nodes: random<2/3?this.oldnodes: []);
      let finalscore = 0;
      let tobreak = false;
      const qAndA = [];
      for (let j = 0; j < this.questions.length; j++) {
        const start = Date.now()
        const answer = this._predict(clone, this.questions[j].input);
        const timed = Date.now() - start;
        const score =
          this.scoreAnswer(answer, this.questions[j].output) + timed;
        finalscore += score;
        qAndA.push({
          input: this.questions[j].input,
          output: answer,
          score: score
        })
        if (finalscore !== finalscore || finalscore / (j+1) >best.score || finalscore == Infinity) {
          tobreak = true;
          break;
        }
      }
      if (tobreak) {
        continue;
      }
      finalscore /= this.questions.length;
      if (finalscore < best.score || (finalscore == best.score && best.nodes.length > clone.length)) {
        best.score = finalscore;
        best.nodes = clone;
        best.botID = i
        best.qAndA = qAndA;
      }
    }
    if (this.result > best.score) {
      this.oldnodes = this.nodes;
      this.nodes = best.nodes;
      this.result = best.score;
      this.gen++
    }
  }
}

module.exports = BlastAI

export default BlastAI;
export type { question, node};