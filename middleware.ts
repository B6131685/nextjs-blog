import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(request: NextRequest) {
  // console.log('middleware working')
  // console.log("request.cookies at middleware",request.cookies)
  const env = process.env.NODE_ENV;
  let authToken: RequestCookie | undefined;

  if (request.nextUrl.pathname.search("new") === 1) {
    const url = request.nextUrl.clone();
    env == "development"
      ? (authToken = request.cookies.get("next-auth.session-token"))
      : (authToken = request.cookies.get("__Secure-next-auth.session-token"));
    url.pathname = "/blogs";
    if (!authToken) return NextResponse.redirect(url);
  }
}


export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
