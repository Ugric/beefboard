import { NextApiRequest, NextApiResponse } from "next";
import {db} from "../../database/database";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const data: {
      [key: string]: {
        id: string;
        time: number;
        recap: string;
      }
    } = req.body;
    await db.up()
    await Promise.all(
      Object.keys(data).map((postID) =>
        db.db?.run(
          `INSERT INTO watchtime (UUID, postID, time) VALUES (?, ?, ?)`,
          ["0", data[postID].id, data[postID].time]
        )
      )
    );
    return res.status(200).send(undefined);
  }
  return res.status(400).send(undefined);
};
