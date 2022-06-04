import { NextApiRequest, NextApiResponse } from "next";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
    if (req.method == "POST") {
        const data: { id: string, time: number }[] = req.body
        
       return res.status(200).send(undefined);
    }
    return res.status(400).send(undefined);
};
