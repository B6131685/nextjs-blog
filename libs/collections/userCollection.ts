import { Collection, Document } from "mongodb";
import monogDBDriver from "../mongodb";

export const UserCollection = async (): Promise<Collection<Document>> => {
  try {
    const client = await monogDBDriver;
    const db = client.db("blog-next-rfc");
    const user = db.collection("users");

    return user;
  } catch (error) {
    throw new Error('can not connect users Collection')
  }
};


