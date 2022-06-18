import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import cookieParser from "cookie-parser";
import { db } from "../../database/database";
import testRECAP3 from "../../components/recaptcha_server";

type watchtimeReqData = {
  watchtime: string;
  recaptcha: string;
};

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, _, res) {
    res
      .status(501)
      .json({
        err: `Sorry, there was an internal server error! Please try again later.`,
      });
    console.error(error)
  },
  onNoMatch(req, res) {
    res.status(405).json({ err: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(cookieParser());
apiRoute.use(require("express-fileupload")());

apiRoute.post(async (req, res) => {
  const body: watchtimeReqData = req.body;
  const recaptcha = await testRECAP3(body.recaptcha);
  if (recaptcha) {
    const watchtime: Record<
      string,
      {
        id: string;
        time: number;
      }
    > = JSON.parse(body.watchtime);
    await Promise.all(
      Object.entries(watchtime).map(async ([_, { id, time }]) => {
        await db.up();
        await db.db?.run(
          `INSERT INTO watchtime (UUID, postID, time) VALUES (?, ?, ?)`,
          ["0", id, time]
        );
      })
    );
  }
  res.status(200).send(undefined);
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
export type { watchtimeReqData };
