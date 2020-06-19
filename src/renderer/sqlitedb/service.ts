import { timeStart, timeEnd, createAUser } from "../utils";
import { getUserModel } from "./models/Person";
import { UserDocType } from "../types";
import { promiseProgress } from "./helpers";

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
