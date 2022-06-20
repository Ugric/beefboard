import sqlite3 from "sqlite3";
import { Database, open } from "sqlite";
const queue: ((db: Database<sqlite3.Database, sqlite3.Statement>) => void)[] =
  [];
const db: {
  db: Database<sqlite3.Database, sqlite3.Statement> | undefined;
  queue: (
    callback: (db: Database<sqlite3.Database, sqlite3.Statement>) => void
  ) => void;
  up: () => Promise<Database<sqlite3.Database, sqlite3.Statement>>;
} = {
  db: undefined,
  queue: (
    callback: (db: Database<sqlite3.Database, sqlite3.Statement>) => void
  ) => {
    queue.push(callback);
  },
  up: () => new Promise((resolve) => db.queue(resolve)),
};
(async () => {
  db.db = await open({
    filename: "./database/database.db",
    driver: sqlite3.Database,
  });
  await Promise.all([
    db.db.run("CREATE TABLE IF NOT EXISTS watchtime (UUID, postID, time)"),
    db.db.run("CREATE TABLE IF NOT EXISTS posts (UUID, postID, title, time)"),
    db.db.run(
      "CREATE TABLE IF NOT EXISTS postcontent (postID, type, content, alt, setorder)"
    ),
    db.db.run("CREATE TABLE IF NOT EXISTS postvotes (postID, UUID, vote)"),
    db.db.run("CREATE TABLE IF NOT EXISTS file (hash, filename, realfilename, contenttype)"),
    db.db.run("CREATE TABLE IF NOT EXISTS fileReferance (ReferenceID, hash)"),
    db.db.run("CREATE TABLE IF NOT EXISTS seen (UUID, postID, time)"),
  ]);
  db.queue = (
    callback: (db: Database<sqlite3.Database, sqlite3.Statement>) => void
  ) => {
    callback(db.db!);
  };
  db.up = async ()=>db.db!
  for (const callback of queue) {
    callback(db.db);
  }
})();

export { db };
