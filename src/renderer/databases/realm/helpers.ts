// import { Person as KPerson } from "./schema";
import getDB from "./db";
// import { UserDocType } from "../types";
import { timeStart, timeEnd } from "../../utils";
import { Person } from "./Person";

// const addAUser = (user: UserDocType): KPerson => {
//   const addedUser = getDB().create(KPerson, user);
//   return addedUser;
// };

export const getCount = () => {
  const t0 = timeStart();

  const count = getDB().objects(Person).length;
  console.log("Total users Count: ", count);
  timeEnd(t0, `getCount - ${count}`);
  return count;
};

export const getDocs = (
  count: number,
  page: number = 1,
  saveTimeTaken?: React.Dispatch<React.SetStateAction<[number, number]>>
) => {
  const t0 = timeStart();
  const allDocs = getDB().objects<Person>(Person).filtered("phone != name");
  const skip = (page - 1) * count;
  let lazyDocs = allDocs.slice(skip, skip + count);
  const docs = Array.from(lazyDocs);
  console.log(
    `retrived ${docs.length} docs from users (skipped : ${page * count})`
  );
  const timeTaken = timeEnd(t0, `getDocs - ${docs.length} items`);
  saveTimeTaken && saveTimeTaken([timeTaken, docs.length]);
  return (docs as unknown) as Person[];
};

export const addUserstoRealm = async (
  total: number,
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  saveTimeTaken?: React.Dispatch<React.SetStateAction<[number, number]>>
) => {
  setProgress(100);
  const t0 = performance.now();
  const timeTaken = [];
  // if the chunk is the default one set it to an appropriate value (max of 100 or .5% increment is considered)
  let docID = getCount();
  const ta0 = performance.now();
  Person.AddDummyPersons(total, docID);
  const ta1 = performance.now();
  timeTaken.push(ta1 - ta0);
  const t1 = performance.now();
  console.log(
    `realm: Time Taken to add ${total} users : ${(ta1 - ta0).toFixed(1)}ms/${(
      t1 - t0
    ).toFixed(1)}`
  );
  saveTimeTaken && saveTimeTaken([+(ta1 - ta0).toFixed(2), total]);
  setProgress(100);
  console.log("done adding users");
};

export const deleteAllUsers = () => {
  Person.deleteAllPersons();
};
