import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import cookieParser from "cookie-parser";
import fileupload from "express-fileupload";
import { getFile } from "../../database/file";

type uploadContext = {
  type: string;
  content: string | number;
}[];
const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, _, res) {
    res.status(501).json({
      err: `Sorry, there was an internal server error! Please try again later.`,
    });
    console.error(error);
  },
  onNoMatch(req, res) {
    res.status(405).json({ err: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(cookieParser());
apiRoute.use(fileupload());

apiRoute.get(async (req, res, next) => {
  const resp = await getFile(String(req.query.id));
  if (resp) {
    return resp.pipe.pipe(res);
  }
  res.status(404).send(undefined);
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
    responseLimit: false,
  },
};
export type { uploadContext };
