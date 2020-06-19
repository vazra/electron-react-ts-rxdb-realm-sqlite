import getDB from "./db";
import { UserDocType } from "../types";
import { createAUser } from "../utils";
export const COLL_PERSON = "Person";

export class Person {
  static schema = {
    name: COLL_PERSON,
    primaryKey: "id",

    properties: {
      id: { type: "string", indexed: true },
      name: "string",
      phone: "string",
      address: "string",
      area: "string",
    },
  };

  static getPersons(perPageCount?: number, pageNo?: number) {
    if (perPageCount && pageNo) {
      return getDB()
        .objects(COLL_PERSON)
        .slice((pageNo - 1) * perPageCount, perPageCount);
    } else {
      return getDB().objects(COLL_PERSON);
    }
  }

  static addPerson(doc: UserDocType) {
    const db = getDB();
    const newObj = { ...doc, id: Math.random() };
    db.write(() => db.create(COLL_PERSON, newObj));
  }

  static bulkAddPersons(docs: UserDocType[], firstid?: number) {
    const db = getDB();

    let docId =
      firstid === undefined ? Math.floor(Math.random() * 10000000) : firstid;
    db.write(() => {
      for (let aDoc of docs) {
        const newObj = { ...aDoc, id: docId.toString() };
        db.create(COLL_PERSON, newObj);
        docId = docId + 1;
      }
    });
  }

  static AddDummyPersons(count: number, firstid?: number) {
    const db = getDB();

    let docId =
      firstid === undefined ? Math.floor(Math.random() * 10000000) : firstid;
    db.write(() => {
      for (let i = 0; i < count; i++) {
        const aDoc = createAUser();
        const newObj = { ...aDoc, id: docId.toString() };
        db.create(COLL_PERSON, newObj);
        docId = docId + 1;
      }
    });
  }
}
