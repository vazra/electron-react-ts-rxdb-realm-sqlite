/* eslint-disable no-console */
import {
  createRxDatabase,
  addRxPlugin,
  RxDatabase,
  RxJsonSchema,
  checkAdapter,
} from "rxdb";
import { timeStart, timeEnd, getDBDir } from "../utils/helpers";
import {
  UserCollection,
  UserDocType,
  UserCollectionMethods,
  MyDatabaseCollections,
  MyDatabase,
  IAdapter,
} from "../types";

import { RxDBAdapterCheckPlugin } from "rxdb/plugins/adapter-check";
import { RxDBEncryptionPlugin } from "rxdb/plugins/encryption";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBValidatePlugin } from "rxdb/plugins/validate";

let dbPromise: Promise<RxDatabase<MyDatabaseCollections>>;
const supportedAdapters: IAdapter[] = [];

addRxPlugin(RxDBAdapterCheckPlugin);
addRxPlugin(RxDBEncryptionPlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBValidatePlugin);

addRxPlugin(require("pouchdb-adapter-memory"));
addRxPlugin(require("pouchdb-adapter-idb"));
addRxPlugin(require("pouchdb-adapter-node-websql"));
// addRxPlugin(require("pouchdb-adapter-websql"));
addRxPlugin(require("pouchdb-adapter-leveldb"));

const _checkAdapter = () => {
  checkAdapter("localstorage").then((val) => {
    console.log("RXJS -> Adapter -> localstorage status :", val);
    if (val && supportedAdapters.indexOf("localstorage") === -1)
      supportedAdapters.push("localstorage");
  });
  checkAdapter("idb").then((val) => {
    console.log("RXJS -> Adapter -> idb status :", val);
    if (val && supportedAdapters.indexOf("idb") === -1)
      supportedAdapters.push("idb");
  });
  checkAdapter("memory").then((val) => {
    console.log("RXJS -> Adapter -> memory status :", val);
    if (val && supportedAdapters.indexOf("memory") === -1)
      supportedAdapters.push("memory");
  });
  checkAdapter("leveldb").then((val) => {
    console.log("RXJS -> Adapter -> leveldb status :", val);
    if (val && supportedAdapters.indexOf("leveldb") === -1)
      supportedAdapters.push("leveldb");
  });
};
_checkAdapter();

const userSchema: RxJsonSchema<UserDocType> = {
  title: "vendor schema",
  description: "describes a vendor",
  version: 0,
  keyCompression: false,
  type: "object",
  properties: {
    name: {
      type: "string",
    },
    phone: {
      type: "string",
      primary: true,
    },
    address: {
      type: "string",
    },
    area: {
      type: "string",
    },
  },
  required: ["name", "phone", "address"],
};

const userCollectionMethods: UserCollectionMethods = {
  async getCount(this: UserCollection) {
    const t0 = timeStart();
    const allDocs = await this.find().exec();
    console.log("Total users Count: ", allDocs.length);
    timeEnd(t0, `getCount - ${allDocs.length}`);
    return allDocs.length;
  },
  async getCountPouch(this: UserCollection) {
    const t0 = timeStart();

    const entries = await this.pouch.allDocs().catch((err) => {
      console.log("failed alldocs", err);
    });
    console.log("Total users Count: ", entries.rows.length);
    timeEnd(t0, `getCountPouch - ${entries.rows.length}`);

    return entries.rows.length;
  },

  async getCountWithInfo(this: UserCollection) {
    const t0 = timeStart();
    const info = await this.pouch.info();
    console.log("Total users Count: ", info.doc_count);
    timeEnd(t0, `getCountWithInfo - ${info.doc_count}`);
    return info.doc_count;
  },

  async getDocs(
    this: UserCollection,
    count: number,
    page: number = 1,
    saveTimeTaken?: React.Dispatch<React.SetStateAction<[number, number]>>
  ) {
    const t0 = timeStart();

    const allDocs = await this.find()
      .skip(count * (page - 1))
      .limit(count)
      .exec();
    console.log(
      `retrived ${allDocs.length} docs from users (skipped : ${page * count})`
    );
    const timeTaken = timeEnd(t0, `getDocs - ${allDocs.length} items`);
    saveTimeTaken && saveTimeTaken([timeTaken, allDocs.length]);
    return allDocs;
  },

  async getDocsPouch(this: UserCollection, count: number, page: number = 0) {
    const t0 = timeStart();
    const allDocs = await this.pouch.allDocs({ include_docs: true });
    timeEnd(t0, `getDocsPouch - ${allDocs.length} items`);
    return allDocs;
  },

  async addDocs(
    this: UserCollection,
    docs: UserDocType[],
    saveTimeTaken?: React.Dispatch<React.SetStateAction<[number, number]>>
  ) {
    const t0 = timeStart();
    const res = await this.bulkInsert(docs);
    const timeTaken = timeEnd(t0, `addDocs - ${docs.length} items`);
    saveTimeTaken && saveTimeTaken([timeTaken, docs.length]);

    return res;
  },
};

const collections = [
  {
    name: "users",
    schema: userSchema,
    // methods: userDocMethods,
    statics: userCollectionMethods,
  },
];

const createDB = async (adapter: IAdapter) => {
  console.log("DatabaseService: creating database..");
  let dbname = "testdb";
  if (adapter === "leveldb") dbname = getDBDir("rxdb", "data.ldb");
  if (adapter === "websql") dbname = getDBDir("rxdb", "data.sqlite");

  const db: MyDatabase = await createRxDatabase<MyDatabaseCollections>({
    name: dbname, // <- name
    adapter: adapter, // <- storage-adapter
    password: "passpasspass", // <- password (optional)
    multiInstance: false, // This should be set to false when you have single-instances like a single-window electron-app
    eventReduce: true, // <- eventReduce (optional, default: true)
  });

  console.dir(db);
  console.log("DatabaseService: created database");
  // window.db = db; // write to window for debugging

  // create collections
  // console.log("DatabaseService: create collections");
  await Promise.all(collections.map((colData) => db.collection(colData)));

  // hooks
  // console.log("DatabaseService: add hooks");
  // db.heroes.postInsert(
  //   function myPostInsertHook(
  //     this: HeroCollection, // own collection is bound to the scope
  //     _docData: HeroDocType, // documents data
  //     doc: HeroDocument // RxDocument
  //   ) {
  //     console.log(`insert to ${this.name}-collection: ${doc.name}`);
  //   },
  //   false // not async
  // );

  // TODO   : A function to input collectionId, and sync it with firestore db
  // db.$.subscribe((changeEvent) => console.dir(changeEvent));

  return db;
};

const deleteDB = async () => {
  if (!dbPromise) return false;
  const db = await dbPromise;
  await db.destroy();
  await db.remove();
  return true;
};

export const changeAdapter = async (adapter: IAdapter) => {
  console.warn(`re-creating database with adapter '${adapter}'`);
  await deleteDB();
  dbPromise = createDB(adapter);
  return dbPromise;
};

const getDB = async (adpater: IAdapter) => {
  if (!dbPromise) dbPromise = createDB(adpater);
  return dbPromise;
};

// eslint-disable-next-line import/prefer-default-export
export { getDB, supportedAdapters };
