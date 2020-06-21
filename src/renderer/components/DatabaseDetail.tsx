import React from "react";

export type IDatabaseMode = "RxDB" | "SQLite" | "Realm";

interface IDatabaseDetail {
  dbType: IDatabaseMode;
}

export function DatabaseDetail({ dbType }: IDatabaseDetail) {
  return <div className={classes.root} />;
}

export default DatabaseDetail;
