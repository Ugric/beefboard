import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import cookieParser = require("cookie-parser");

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


apiRoute.post((req, res) => {
  const body: watchtimeReqData = req.body;
  const recaptcha = body.recaptcha;
  const watchtime = (JSON.parse(body.watchtime));
  res.status(200).json({ data: "success" });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
export type { watchtimeReqData };