import { BlogsCollection } from "@/libs/collections/blogCollection";
import { TagCollection } from "@/libs/collections/tagCollection";
import monogDBDriver from "@/libs/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } //context
) {
  try {
    const { id } = params;
    const client = await monogDBDriver;
    const db = await BlogsCollection();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ msg: "invalid ID" }, { status: 400 });
    }

    const blogs = await db
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          },
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
        // {
        //   $set: {
        //     user:{
        //       email: "encode"
        //     }
        //   }
        // },
        { $unwind: "$user" },
      ])
      // .project({ user: { _id: 0} })
      .toArray();

    if (!blogs) {
      return NextResponse.json({ msg: "Not found ID" }, { status: 404 });
    }

    return NextResponse.json({ ...blogs[0] }, { status: 200 });
  } catch (error) {}
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const client = await monogDBDriver;
    const db = client.db("blog-next-rfc").collection("blogs");

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "invalid ID" }, { status: 400 });
    }

    const result = await db.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "delete : " + id }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Not found ID for delete" },
        { status: 404 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {id} = params
    const blogCollection = await BlogsCollection();
    const tagCollection = await TagCollection();
    const idTageArr: ObjectId[] = [];
    if(!ObjectId.isValid(id)){
     throw new Error('ID Blog is invalid')
    }

    const json = await request.json()
    const { title, tage, content } = json

    const uniqueArray: string[] = [
      ...new Set(tage.map((word: string) => word.toLowerCase())),
    ] as string[];

  const alltags = await tagCollection.find({}).toArray();
  const arrCheckTag = alltags.map((doc: any) => doc.tageLabel);

    for (let index = 0; index < uniqueArray.length; index++) {
      if (arrCheckTag.includes(uniqueArray[index])) {
        const find = alltags.find(
          (tage) => tage.tageLabel === uniqueArray[index]
        );
        idTageArr.push(find?._id as ObjectId);
      } else {
        const doc = await tagCollection.insertOne({
          tageLabel: uniqueArray[index],
        });
        idTageArr.push(doc.insertedId);
      }
    }
    
    const resulte =  await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set:{
          title,
          content,
          tags: idTageArr,
          updateAt: new Date(),
        }
      }
    )

    return NextResponse.json({ resulte }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: error }, { status: 500 });
  }
}
