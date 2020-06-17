import Realm from "realm";

import { Person } from "./Person";
const defaultPath = Realm.defaultPath;
const newPath =
  defaultPath.substring(0, defaultPath.lastIndexOf("/")) +
  "/anotherRealm.realm";
console.log("kkk defaultPath : ", defaultPath);
console.log("kkk expected realm path: ", newPath);

const dbConfig: Realm.Configuration = {
  schema: [Person],
  deleteRealmIfMigrationNeeded: true,
  path: "./.db/shdb/data.realm",
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
