import { TagCollection } from "@/libs/collections/tagCollection";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tagsCollection = await TagCollection();
    const tageArr = await tagsCollection.find({}).toArray();
    return NextResponse.json(tageArr, { status: 200});
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({message: error.message}, { status: 500 });
    }
    return NextResponse.json({error},{status:500})
  }
}
