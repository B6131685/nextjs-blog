import { Collection, Document } from "mongodb";
import monogDBDriver from "../mongodb";

export const BlogsCollection = async (): Promise<Collection<Document>> => {
  try {
    const client = await monogDBDriver;
    const db = client.db("blog-next-rfc");
    const blogs = db.collection("blogs");

    return blogs;
  } catch (error) {
    throw new Error("can not connect blogs Collection");
  }
};
