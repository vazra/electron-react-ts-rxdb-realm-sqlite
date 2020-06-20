import { connect } from "trilogy";
import { getDBDir } from "./helpers";

const dbPath = getDBDir("sqlite", "data.sqlite");

// export const db = connect(dbPath, {
//   client: "sql.js",
// });
export const db = connect(dbPath);
