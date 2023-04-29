import { Collection, Document } from "mongodb";
import monogDBDriver from "../mongodb";

export const TagCollection = async (): Promise<Collection<Document>> => {
  try {
    const client = await monogDBDriver;
    const db = client.db("blog-next-rfc");
    const tags = db.collection("tags");

    return tags;
  } catch (error) {
    throw new Error("can not connect tags Collection");
  }
};
