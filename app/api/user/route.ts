import { NextResponse} from 'next/server';
import { type NextRequest } from 'next/server'
import monogDBDriver from "@/libs/mongodb";
export async function POST(request: NextRequest) {
    const client = await monogDBDriver;
    const db = client.db("blog-next-rfc");
    const {email} = await request.json()
    // console.log(json) // { email: 'example@mail.com' }
    const user = db.collection("users").insertOne({
        email 
    })
    return NextResponse.json({data:user})
}