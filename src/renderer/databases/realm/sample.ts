import Realm from "realm";

export const testRealm = () => {
  Realm.open({
    schema: [
      {
        name: "Page",
        properties: {
          id: "int",
        },
      },
    ],
  }).then((realm) => {
    console.time("nothing");
    console.timeEnd("nothing");

    console.time("warmup");
    realm.write(() => {
      for (let i = 0; i < 10; i++) {
        realm.create("Page", { id: 5 });
      }
    });
    console.timeEnd("warmup");

    for (let objects = 0; objects <= 1000; objects += 100) {
      let test = "Objects " + objects;
      console.time(test);
      realm.write(() => {
        for (let i = 0; i < 100; i++) {
          realm.create("Page", { id: 5 });
        }
      });
      console.timeEnd(test);
    }
  });
};
