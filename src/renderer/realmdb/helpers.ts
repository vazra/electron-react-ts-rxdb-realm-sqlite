// import { Person as KPerson } from "./schema";
import getDB, { getDbPromise } from "./db";
import { UserDocType } from "../types";
import { createAUser, timeStart, timeEnd } from "../utils";
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

export const getDocs = async (
  count: number,
  page: number = 1,
  saveTimeTaken?: React.Dispatch<React.SetStateAction<[number, number]>>
) => {
  console.log("getDocs");
  const t0 = timeStart();
  const allDocs = getDB().objects<Person>(Person).filtered("phone != name");

  // get first 5 Car objects
  let docs = allDocs; // .slice((page - 1) * count, count);

  // const docs : Person[] = []

  // for (let aDoc of lazyDocs){
  //   docs.push(aDoc)
  // }

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
  saveTimeTaken?: React.Dispatch<React.SetStateAction<[number, number]>>,
  chunk?: number
) => {
  const t0 = performance.now();
  const db = await getDbPromise();
  const timeTaken = [];
  // if the chunk is the default one set it to an appropriate value (max of 100 or .5% increment is considered)
  if (!chunk) {
    chunk = Math.max(100, Math.ceil(total / 200));
  }
  console.log("inserting data in chunks of ", chunk);

  const chunkArray = Array(Math.floor(total / chunk)).fill(chunk);
  if (total % chunk > 0) chunkArray.push(total % chunk);
  console.log("chunk arry", chunkArray);
  let done = 0;
  let docID = getCount();
  console.log("Starting ID is ", docID);
  for (const aChunk of chunkArray) {
    const userArry: UserDocType[] = [];
    for (let i = 0; i < aChunk; i++) {
      userArry.push(createAUser());
    }
    const ta0 = performance.now();
    db.write(() => {
      for (let aUserObj of userArry) {
        db.create(Person, { ...aUserObj, id: docID.toString() });
        docID++;
      }
    });

    const ta1 = performance.now();
    timeTaken.push(ta1 - ta0);
    done = done + aChunk;
    setProgress(+((done / total) * 100).toFixed(1));
    // console.log(
    //   `inserted ${result?.success.length} docs & failed ${result?.error.length} docs`
    // );
  }
  console.log("Ending ID is ", docID - 1);

  const t1 = performance.now();
  console.log(
    `realm: Time Taken to add ${total} users : ${(t1 - t0).toFixed(1)}ms`
  );
  console.log(
    `Pass: ${timeTaken.length}, time: ${timeTaken
      .reduce((a, b) => a + b, 0)
      .toFixed(1)},min: ${Math.min(...timeTaken).toFixed(1)},max: ${Math.max(
      ...timeTaken
    ).toFixed(1)},avg: ${(
      timeTaken.reduce((a, b) => a + b, 0) / timeTaken.length
    ).toFixed(1)},  `
  );
  saveTimeTaken &&
    saveTimeTaken([+timeTaken.reduce((a, b) => a + b, 0).toFixed(2), done]);
  console.log("done adding users");
  // process.exit();
};
