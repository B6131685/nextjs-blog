import { TagCollection } from "@/libs/collections/tagCollection";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tagsCollection = await TagCollection();
    const tageArr = await tagsCollection.find({}).toArray();
    return NextResponse.json(tageArr, { status: 200 , headers:[
      ["Access-Control-Allow-Credentials","true"],
      ["Access-Control-Allow-Origin","**"],
      ["Access-Control-Allow-Methods","GET,OPTIONS,PATCH,DELETE,POST,PUT"],
      ["Access-Control-Allow-Headers","X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"]
    ]});
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({message: error.message}, { status: 500 });
    }
    return NextResponse.json({error},{status:500})
  }
}
