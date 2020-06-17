import { Person as KPerson } from "./schema";
import getDB from "./db";
import { UserDocType } from "../types";
import { createAUser, timeStart, timeEnd } from "../utils";

// const addAUser = (user: UserDocType): KPerson => {
//   const addedUser = getDB().create(KPerson, user);
//   return addedUser;
// };

export const getCount = () => {
  const t0 = timeStart();

  const count = getDB().objects(KPerson).length;

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
  const allDocs = getDB().objects<KPerson>(KPerson).filtered("phone != name");

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
  return (docs as unknown) as KPerson[];
};

// export const addUserstoRealm = async (
//   total: number,
//   setProgress: React.Dispatch<React.SetStateAction<number>>,
//   saveTimeTaken?: React.Dispatch<React.SetStateAction<[number, number]>>,
//   chunk?: number
// ) => {
//   const t0 = performance.now();
//   const timeTaken = [];

//   // if the chunk is the default one set it to an appropriate value (max of 100 or .5% increment is considered)
//   if (!chunk) {
//     chunk = Math.max(100, Math.ceil(total / 200));
//   }
//   console.log("inserting data in chunks of ", chunk);

//   const chunkArray = Array(Math.floor(total / chunk)).fill(chunk);
//   if (total % chunk > 0) chunkArray.push(total % chunk);
//   console.log("chunk arry", chunkArray);
//   let done = 0;

//   for (const aChunk of chunkArray) {
//     const userArry = [];
//     for (let i = 0; i < aChunk; i++) {
//       userArry.push(createAUser());
//     }
//     const ta0 = performance.now();
//     for (let aUserObj of userArry) {
//       await addAUser(aUserObj);
//     }
//     const ta1 = performance.now();
//     timeTaken.push(ta1 - ta0);
//     done = done + aChunk;
//     setProgress(+((done / total) * 100).toFixed(1));
//     // console.log(
//     //   `inserted ${result?.success.length} docs & failed ${result?.error.length} docs`
//     // );
//   }
//   const t1 = performance.now();
//   console.log(
//     `realm: Time Taken to add ${total} users : ${(t1 - t0).toFixed(1)}ms`
//   );
//   console.log(
//     `Pass: ${timeTaken.length}, time: ${timeTaken
//       .reduce((a, b) => a + b, 0)
//       .toFixed(1)},min: ${Math.min(...timeTaken).toFixed(1)},max: ${Math.max(
//       ...timeTaken
//     ).toFixed(1)},avg: ${(
//       timeTaken.reduce((a, b) => a + b, 0) / timeTaken.length
//     ).toFixed(1)},  `
//   );
//   saveTimeTaken &&
//     saveTimeTaken([+timeTaken.reduce((a, b) => a + b, 0).toFixed(2), done]);
//   // console.log(db);
// };

export const addUserstoRealm = (
  total: number,
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  saveTimeTaken?: React.Dispatch<React.SetStateAction<[number, number]>>,
  chunk?: number
) => {
  Realm.open({
    schema: [KPerson],
  }).then((realm) => {
    const t0 = performance.now();
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

    for (const aChunk of chunkArray) {
      const userArry: UserDocType[] = [];
      for (let i = 0; i < aChunk; i++) {
        userArry.push(createAUser());
      }
      const ta0 = performance.now();
      realm.write(() => {
        for (let aUserObj of userArry) {
          realm.create(KPerson, aUserObj);
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
    // process.exit();
  });
};
