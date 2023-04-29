import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { UserCollection } from "@/libs/collections/userCollection";
import { ObjectId } from "mongodb";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    let usersCollection = await UserCollection();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "invalid ID" }, { status: 400 });
    }
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json( user, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ massage: error.message }, { status: 500 });
    }
  }
}
