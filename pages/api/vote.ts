import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import cookieParser from "cookie-parser";
import { db } from "../../database/database";
import testRECAP3 from "../../components/recaptcha_server";

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
  if (req.method == "POST") {
    const data: {
      id: string;
      vote: number;
      recaptcha: string;
    } = req.body;
    await db.up();
    const recaptcha = await testRECAP3(data.recaptcha);
    if (recaptcha) {
      await db.db?.run(
        `INSERT INTO postvotes (UUID, postID, vote) VALUES (?, ?, ?)`,
        ["0", data.id, data.vote]
      );
      return res.status(200).send(undefined);
    }
  }
  return res.status(400).send(undefined);
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
