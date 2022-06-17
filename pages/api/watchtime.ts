import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import cookieParser from "cookie-parser";
import { db } from "../../database/database";

type watchtimeReqData = {
  watchtime: string;
  recaptcha: string;
};

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, _, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(require("morgan")("combined"));
apiRoute.use(cookieParser());
apiRoute.use(require("express-fileupload")());

apiRoute.post(async (req, res) => {
  const body: watchtimeReqData = req.body;
  const recaptcha = body.recaptcha;
  const watchtime: Record<
    string,
    {
      id: string;
      time: number;
    }
  > = JSON.parse(body.watchtime);
  await Promise.all(
    Object.entries(watchtime).map(async ([id, { time }]) => {
      await db.up();
      await db.db?.run(
        `INSERT INTO watchtime (UUID, postID, time) VALUES (?, ?, ?)`,
        ["0", id, time]
      );
    })
  );
  res.status(200).send(undefined);
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
export type { watchtimeReqData };
