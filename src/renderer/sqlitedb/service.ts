import { timeStart, timeEnd, createAUser, promiseProgress } from "../utils";
import { getUserModel } from "./models/Person";
import { UserDocType } from "../types";
import { db } from "./db";

export const getCount = async () => {
  const t0 = timeStart();
  const users = await getUserModel();

  const count = await users.count();

  console.log("Total users Count: ", count);
  timeEnd(t0, `getCount - ${count}`);
  return count;
};

export const getDocs = async (
  limit: number,
  page: number = 1,
  saveTimeTaken?: React.Dispatch<React.SetStateAction<[number, number]>>
) => {
  console.log("getDocs");
  const users = await getUserModel();

  const t0 = timeStart();
  const skip = (page - 1) * limit;

  const docs = await users.find({}, { limit, skip });
  console.log(`retrived ${docs.length} docs from users (skipped : ${skip})`);
  const timeTaken = timeEnd(t0, `getDocs - ${docs.length} items`);
  saveTimeTaken && saveTimeTaken([timeTaken, docs.length]);
  return docs;
};

export const addUserstoDB = async (
  total: number,
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  saveTimeTaken?: React.Dispatch<React.SetStateAction<[number, number]>>
) => {
  const t0 = performance.now();
  const timeTaken = [];

  const sqliteChunkLimit = 200; // this should be changed, hardcoded to fix SQLITE ERROR, Toomany Variables
  const chunk = Math.min(Math.floor(total / 100), sqliteChunkLimit);
  console.log("inserting data in chunks of ", chunk);

  const chunkArray = Array(Math.floor(total / chunk)).fill(chunk);
  if (total % chunk > 0) chunkArray.push(total % chunk);
  let done = 0;

  for (const aChunk of chunkArray) {
    const userArry = [];
    for (let i = 0; i < aChunk; i++) {
      userArry.push(createAUser());
    }
    const ta0 = performance.now();
    await db.knex<UserDocType>("users").insert(userArry);
    const ta1 = performance.now();
    timeTaken.push(ta1 - ta0);
    done = done + aChunk;
    setProgress(+((done / total) * 100).toFixed(1));
  }
  const t1 = performance.now();
  console.log(
    `sqlite: Time Taken to add ${total} users : ${(t1 - t0).toFixed(1)}ms`
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
};

export const addUserstoDBV1 = async (
  total: number,
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  saveTimeTaken?: React.Dispatch<React.SetStateAction<[number, number]>>
) => {
  setProgress(0);
  let progrssVal = 0;
  const users = await getUserModel();
  const t0 = performance.now();
  const timeTaken = [];
  const usersListPromise: Promise<UserDocType | undefined>[] = [];
  for (let i = 0; i < total; i++) {
    const aDoc = createAUser();
    const userPromise = users.create(aDoc);
    usersListPromise.push(userPromise);
  }
  const ta0 = performance.now();

  //   await Promise.all(usersListPromise);
  await promiseProgress(usersListPromise, (percent) => {
    // set progress only for 1% increase
    if (progrssVal + 1 <= percent) {
      console.log("kke progress => ", percent, progrssVal);
      progrssVal = Math.ceil(percent);
      setProgress(percent);
    }
  });

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

export const deleteAllUsers = async () => {
  const users = await getUserModel();
  return await users.clear();
};
