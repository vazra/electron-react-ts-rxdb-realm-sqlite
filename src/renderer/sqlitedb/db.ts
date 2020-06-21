import { connect } from "trilogy";
import { getDBDir } from "../utils";

const dbPath = getDBDir("sqlite", "data.sqlite");

// export const db = connect(dbPath, {
//   client: "sql.js",
// });
export const db = connect(dbPath);
