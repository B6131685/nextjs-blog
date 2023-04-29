import { bucket } from "@/configs/fireAdmin/init-firebase";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server'
import { uuid } from "uuidv4";

export async function GET(request: Request) {
  return new Response("Hello, Next.js!");
}

export async function POST(req: NextRequest):Promise<NextResponse> {
  try {
    const bodyJSON = await req.json();
    let fileBuffer = Buffer.from(bodyJSON.base64, "base64");

    const uploadOptions = {
      metadata: {
        contentType: "image/png",
      },
    };
    await bucket.makePublic();
    const file = bucket.file(uuid())
    await file.save(fileBuffer, uploadOptions)
    return NextResponse.json({ publicURL: file.publicUrl()});
  } catch (error) {
    return NextResponse.json({err: 'error'})
  }
}
