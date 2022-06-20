import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import cookieParser from "cookie-parser";
import { db } from "../../database/database";
import testRECAP3 from "../../components/recaptcha_server";
import genRand from "../../components/randomstr";
import { fileUpload, uploadFile } from "../../database/file";
import fileupload from "express-fileupload";

type uploadContext = {
  type: string;
  content: string | number;
  alt?: string;
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

apiRoute.post(async (req, res) => {
  const body: {
    recaptcha: string;
    title: string;
    content: string;
  } = req.body;
  const content: uploadContext = JSON.parse(body.content);
  const files: Record<string, fileUpload> = (req as any).files;
  const recaptcha = await testRECAP3(body.recaptcha);
  if (recaptcha) {
    const postID = genRand(11);
    await db.up();
    await Promise.all(
      content.map(async ({ type, content, alt }, index) => {
        await db.db?.run(
          `INSERT INTO postcontent (postID, type, content, alt, setorder) VALUES (?, ?, ?, ?, ?)`,
          [
            postID,
            type,
            await (async () => {
              switch (type) {
                case "text":
                  return content;
                default:
                  console.log(files);
                  const fileID = await uploadFile(files[`file${content}`]);
                  return fileID;
              }
            })(),
            alt,
            index,
          ]
        );
      })
    );
    await db.db?.run(
      `INSERT INTO posts (UUID, postID, title, time) VALUES (?, ?, ?, ?)`,
      ["0", postID, body.title, Date.now()]
    );
    return res.status(200).json({ postID });
  } else {
    return res
      .status(400)
      .json({ err: "unable to upload post, please try again later." });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
export type { uploadContext };
