import { RxDatabase } from "rxdb";
import React from "react";
import faker from "faker";
import { UserDocType, MyDatabaseCollections } from "../types";

export const createAUser = (): UserDocType => {
  var name = faker.name.findName();
  var phone = faker.phone.phoneNumber();
  var address = faker.address.streetAddress();
  var area = faker.address.countryCode();
  return { name, phone, address, area };
};

// ass n - number of dummy users to the db
export const addUserstoDB = async (
  db: RxDatabase<MyDatabaseCollections> | undefined,
  total: number,
  setProgress: React.Dispatch<React.SetStateAction<number>>,
  saveTimeTaken?: React.Dispatch<React.SetStateAction<[number, number]>>,
  chunk?: number
) => {
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
    const userArry = [];
    for (let i = 0; i < aChunk; i++) {
      userArry.push(createAUser());
    }
    const ta0 = performance.now();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    /* const result = */ await db?.users.bulkInsert(userArry);
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
    `${db?.adapter}: Time Taken to add ${total} users : ${(t1 - t0).toFixed(
      1
    )}ms`
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
  // console.log(db);
};

// helper function thart starts performace - time measurement
export const timeStart = () => {
  return performance.now();
};

// helper function  to end and print  - time measurement
export const timeEnd = (timeStart: number, funName: string) => {
  var t1 = performance.now();
  console.log(`fun: ${funName} took ${(t1 - timeStart).toFixed(2)}ms`);
  return +(t1 - timeStart).toFixed(2);
};
export const kkk = "";
