import { BlogsCollection } from "@/libs/collections/blogCollection";
import { UserCollection } from "@/libs/collections/userCollection";
import { Collection, ObjectId,  } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    let usersCollection = await UserCollection();

    if (!id) {
      return NextResponse.json(
        { message: "email is undefine" },
        { status: 400 }
      );
    }

    if(!ObjectId.isValid(id)){
      return NextResponse.json(
        { message: "invalid ID" },
        { status: 400 }
      );
    }
    // const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    // if (!user) {
    //   return NextResponse.json({ message: "Not found" }, { status: 404 });
    // }

    let blogsCollection: Collection = await BlogsCollection();
    const myBlogs = await blogsCollection
      .aggregate([
        {
          $match:{ user: new ObjectId(id) }
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "tags",
            localField: "tags",
            foreignField: "_id",
            as: "tags",
          },
        },
        {
          $sort: {
            createAt: -1,
          },
        },
        { $unwind: "$user" },
      ])
      .project({ content: 0, user: { emailVerified: 0} })
      .toArray();
      
    return NextResponse.json(myBlogs, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}
