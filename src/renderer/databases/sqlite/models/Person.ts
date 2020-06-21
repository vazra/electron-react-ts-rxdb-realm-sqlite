import { db } from "../db";
import { UserDocType } from "../../../types";
import { Model } from "trilogy";

const personSchema = {
  name: String,
  phone: String,
  address: String,
  area: String,
  id: "increments",
};

let userModel: Model<UserDocType> | undefined = undefined;

export const getUserModel = async () => {
  if (!userModel)
    userModel = await db.model<UserDocType>("users", personSchema);
  return userModel;
};
