import { NextApiRequest, NextApiResponse } from "next";
import recommended from "../../AI/recommended";
import { postProps } from "../../components/post";
import { adsenseProps } from "../../components/posts";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<(postProps | adsenseProps)[]>
) => {
  res.status(200).json(await recommended('0'));
};
