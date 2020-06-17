import Realm from "realm";
import path from "path";
const remote = require("electron").remote;
const app = remote.app;
console.log("userData", app.getPath("userData"));

import { Person } from "./Person";
const defaultPath = Realm.defaultPath;
const newPath =
  defaultPath.substring(0, defaultPath.lastIndexOf("/")) +
  "/anotherRealm.realm";
console.log("kkk defaultPath : ", defaultPath);
console.log("kkk expected realm path: ", newPath);
console.log("kkk ELECTRON HOME path: ", app.getPath("home"));
const dbpath = path.join(
  app.getPath("home"),
  "shdesk",
  "realmdb",
  "data.realm"
);

const dbConfig: Realm.Configuration = {
  schema: [Person],
  deleteRealmIfMigrationNeeded: true,
  path: dbpath,
  // path: "./.db/shdb/data.realm",
};

let realmInstance: Realm | null;
let dbPromise: ProgressPromise;

const getDB = (): Realm => {
  if (realmInstance == null) realmInstance = new Realm(dbConfig);
  return realmInstance!;
};

export const getDbPromise = () => {
  if (!dbPromise) dbPromise = Realm.open(dbConfig);
  return dbPromise;
};

export default getDB;
