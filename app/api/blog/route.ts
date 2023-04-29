import monogDBDriver from "@/libs/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const client = await monogDBDriver;
  const db = client.db("blog-next-rfc");
  const json = await request.json();
  const { email, tags = [], ...obj } = json;

  const user = await db.collection("users").findOne({ email: email });
  const uniqueArray: string[] = [
    ...new Set(tags.map((word: string) => word.toLowerCase())),
  ] as string[];
  const idTageArr: ObjectId[] = [];

  const allTags = await db.collection("tags").find({}).toArray();

  const arrCheckTag = allTags.map((doc: any) => doc.tageLabel);

  for (let index = 0; index < uniqueArray.length; index++) {
    if (arrCheckTag.includes(uniqueArray[index])) {
      const find = allTags.find(
        (tage) => tage.tageLabel === uniqueArray[index]
      );
      idTageArr.push(find?._id as ObjectId);
    } else {
      const doc = await db.collection("tags").insertOne({
        tageLabel: uniqueArray[index],
      });
      idTageArr.push(doc.insertedId);
    }
  }
  const data = await db.collection("blogs").insertOne({
    ...obj,
    user: new ObjectId(user?._id),
    tags: idTageArr,
    createAt: new Date(),
    updateAt: new Date(),
  });
  return NextResponse.json({ ...data }, { status: 200 });
}

export async function GET(request: NextRequest) {
  try {
    const pageSize = 1;
    const { searchParams } = new URL(request.url);

    const pageParam: string | null = searchParams.get("page"); // "1", "2", "3" , "" , null
    const query: string | null = searchParams.get("query"); //
    const tag: string | null = searchParams.get("tag");
    if (!pageParam) {
      // !"", !null = true
      return NextResponse.json(
        { msg: "Missing page parameter" },
        { status: 400 }
      );
    } else if (isNaN(Number(pageParam))) {
      return NextResponse.json(
        { msg: "Invalid page parameter format" },
        { status: 400 }
      );
    }

    let page: number = Number(pageParam);
    const client = await monogDBDriver;
    const db = client.db("blog-next-rfc");

    const blogs = await db.collection("blogs").aggregate([
      {
        $match: tag
          ? {
              title: { $regex: query ?? "", $options: "i" },
              tags: { $in: [new ObjectId(tag)] },
            }
          : {
              title: { $regex: query ?? "", $options: "i" },
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
      {
        $sort: {
          createAt: -1,
        },
      },
      { $unwind: "$user" }, //  ไม่ให้เป็น array
    ]);

    const total = (await blogs.clone().toArray()).length;

    const dataPage = await blogs
      .clone()
      .skip(page ? (page - 1) * pageSize : 0)
      .limit(pageSize)
      .project({ content: 0 }) //decrease bandwidth
      .toArray();

    let nexPage: number | null;
    if (page) {
      nexPage = total / pageSize > page ? page + 1 : null;
    } else {
      nexPage = null;
    }

    return NextResponse.json(
      { data: dataPage, total: total, nexPage },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
}
