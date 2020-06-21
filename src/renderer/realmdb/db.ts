import Realm from "realm";

import { Person } from "./Person";
import { getDBDir } from "../utils";

const dbConfig: Realm.Configuration = {
  schema: [Person],
  deleteRealmIfMigrationNeeded: true,
  path: getDBDir("realm", "data.realm"),
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
