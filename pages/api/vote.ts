import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../database/database";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const data: {
        id: string;
        vote: number;
        recap: string;
      } = req.body;
    await db.up();
    await db.db?.run(
            `INSERT INTO postvotes (UUID, postID, vote) VALUES (?, ?, ?)`,
            ['0', data.id, data.vote]
        )
    return res.status(200).send(undefined);
  }
  return res.status(400).send(undefined);
};
