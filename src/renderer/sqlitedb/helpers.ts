import path from "path";
import fs from "fs";

const remote = require("electron").remote;
const app = remote.app;

export const getDBDir = (dbname: string, dbfile: string) => {
  console.log("kkk ELECTRON HOME path: ", app.getPath("home"));
  console.log("kkk ELECTRON userData path: ", app.getPath("userData"));
  const dirPath = path.join(app.getPath("userData"), "db", dbname);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  return path.join(dirPath, dbfile);
};

export function promiseProgress(
  proms: Promise<any>[],
  progress_cb: (x: number) => void
) {
  let d = 0;
  progress_cb(0);
  for (const p of proms) {
    p.then(() => {
      d++;
      progress_cb((d * 100) / proms.length);
    });
  }
  return Promise.all(proms);
}
