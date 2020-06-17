import getDB from "./db";
import { UserDocType } from "../types";
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

  static bulkAddPersons(docs: UserDocType[]) {
    const db = getDB();
    db.write(() => {
      for (let aDoc of docs) {
        const newObj = { ...aDoc, id: Math.random() };
        db.create(COLL_PERSON, newObj);
      }
    });
  }
}
