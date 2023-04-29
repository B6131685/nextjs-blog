import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // console.log('middleware working')
  // console.log("request.cookies at middleware",request.cookies)

  if (request.nextUrl.pathname.search("new") === 1) {
    // search() = string method
    const url = request.nextUrl.clone();
    const auth = request.cookies.get("next-auth.session-token");
    url.pathname = "/blogs";
    if (!auth) return NextResponse.redirect(url);
  }
  return;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
