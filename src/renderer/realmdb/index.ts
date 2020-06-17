// import Realm from "realm";
// import { Person } from "./schema";

// // Define your models and their properties
// const CarSchema = {
//   name: "Car",
//   properties: {
//     make: "string",
//     model: "string",
//     miles: { type: "int", default: 0 },
//   },
// };
// const PersonSchema = {
//   name: "Person",
//   properties: {
//     name: "string",
//     birthday: "date",
//     cars: "Car[]", // a list of Cars
//     picture: "data?", // optional property
//   },
// };

// export const testRealm = () => {
//   console.log("testing realm");
//   Realm.open({ schema: [CarSchema, PersonSchema] })
//     .then((realm) => {
//       // Create Realm objects and write to local storage
//       realm.write(() => {
//         const myCar = realm.create("Car", {
//           make: "Honda",
//           model: "Civic",
//           miles: 1000,
//         });
//         myCar.miles += 20; // Update a property value
//       });

//       // Query Realm for all cars with a high mileage
//       const cars = realm.objects("Car").filtered("miles > 1000");

//       // Will return a Results object with our 1 car
//       cars.length; // => 1

//       // Add another car
//       realm.write(() => {
//         const myCar = realm.create("Car", {
//           make: "Ford",
//           model: "Focus",
//           miles: 2000,
//         });
//       });

//       // Query results are updated in realtime
//       cars.length; // => 2

//       // Remember to close the realm when finished.
//       realm.close();
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
// // import Realm from "realm";

// // class Todo extends Realm.Object {}
// // Todo.schema = {
// //   name: "User",
// //   properties: {
// //     done: { type: "bool", default: false },
// //     text: "string",
// //   },
// // };

// // class TodoList extends Realm.Object {}
// // TodoList.schema = {
// //   name: "TodoList",
// //   properties: {
// //     name: "string",
// //     creationDate: "date",
// //     items: { type: "list", objectType: "Todo" },
// //   },
// // };

// // export default new Realm({ schema: [Todo, TodoList] });
