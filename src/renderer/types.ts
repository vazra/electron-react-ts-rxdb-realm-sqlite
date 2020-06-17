import { RxCollection, RxDocument, RxDatabase } from "rxdb/dist/types/types";

export type UserDocType = {
  name: string;
  phone: string;
  address: string;
  area?: string; // optional
};

export type UserDocMethods = {
  scream: (v: string) => string;
};

export type UserDocument = RxDocument<UserDocType, UserDocMethods>;
export type IAdapter = "idb" | "memory" | "websql" | "leveldb" | "localstorage";

export type MyDatabaseCollections = {
  users: UserCollection;
};

export type MyDatabase = RxDatabase<MyDatabaseCollections>;

// we declare one static ORM-method for the collection
export type UserCollectionMethods = {
  getCount: (this: UserCollection) => Promise<number>;
  getCountPouch: (this: UserCollection) => Promise<number>;
  getCountWithInfo: (this: UserCollection) => Promise<number>;
  addDocs: (
    this: UserCollection,
    docs: UserDocType[],
    saveTimeTaken?: React.Dispatch<React.SetStateAction<[number, number]>>
  ) => void;
  getDocs: (
    this: UserCollection,
    count: number,
    page?: number,
    saveTimeTaken?: React.Dispatch<React.SetStateAction<[number, number]>>
  ) => Promise<UserDocType[]>;
  getDocsPouch: (
    this: UserCollection,
    count: number,
    page: number
  ) => Promise<UserDocType[]>;
};

// and then merge all our types
export type UserCollection = RxCollection<
  UserDocType,
  UserDocMethods,
  UserCollectionMethods
>;
