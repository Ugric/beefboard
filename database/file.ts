import { BinaryLike, createHash } from "crypto";
import genRand from "../components/randomstr";

type fileUpload = { data: BinaryLike; mimetype: string; name: string }

async function uploadFile(file: fileUpload) {
  const hash = createHash("sha256").update(file.data).digest("hex");
  console.log(hash);
  return genRand(15);
}

export { uploadFile };
export type { fileUpload };