import { BinaryLike, createHash } from "crypto";
import { createReadStream } from "fs";
import path from "path";
import genRand from "../components/randomstr";
import { db } from "./database";

type fileUpload = {
  data: BinaryLike;
  mimetype: string;
  name: string;
  mv: (path: string) => Promise<void>;
};

async function uploadFile(file: fileUpload) {
  await db.up();
  const hash = createHash("sha256").update(file.data).digest("hex");
  const isin = Boolean(await db.db?.get(`SELECT * FROM file WHERE hash = ?`, hash));
  const toPromise = [];
    if (!isin) {
    toPromise.push(file.mv(path.join(process.env.ROOT!, "database", "files", hash)));
    toPromise.push(
      db.db?.run(
        `INSERT INTO file (hash, filename, realfilename, contenttype) VALUES (?, ?, ?, ?)`,
        [hash, hash, file.name, file.mimetype]
      )
    );
  }
  const refID = genRand(15);
  toPromise.push(
    await db.db?.run(
      `INSERT INTO fileReferance (ReferenceID, hash) VALUES (?, ?)`,
      [refID, hash]
    )
  );
  await Promise.all(toPromise);
  return refID;
}

async function getFile(refID: string) {
  await db.up();
    const file = await db.db?.get(
        `SELECT * FROM file WHERE hash=(SELECT hash FROM fileReferance WHERE ReferenceID = ?)`,
        [refID]
    );
    if (!file) return undefined;
    const pipe = createReadStream(
        path.join(process.env.ROOT!, "database", "files", file.hash)
    )
    return {
        pipe: pipe,
        contentType: file.contenttype,
        realfilename: file.realfilename
    };
}

async function getFileData(refID: string) {
    await db.up();
    const file = await db.db?.get(
        `SELECT * FROM file WHERE hash=(SELECT hash FROM fileReferance WHERE ReferenceID = ?)`,
        [refID]
    );
    if (!file) return undefined;
    return {
        filename: file.realfilename,
        contentType: file.contenttype
    };

}

export { uploadFile, getFile, getFileData };
export type { fileUpload };
