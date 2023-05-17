import { NextRequest, NextFetchEvent, userAgent } from "next/server";
import { NextResponse } from "next/server";
export function middleware(req: NextRequest, ev: NextFetchEvent) {
  //   console.log("it works! global middleware"); // global 적용

  if (req.nextUrl.pathname.startsWith("/")) {
    const ua = userAgent(req);
    if (ua.isBot) {
      // bot일 때 접근 제한
      return new Response("봇은 이용할 수 없어요!", { status: 403 });
    }
  }
  if (req.nextUrl.pathname.startsWith("/chats")) {
    // chats 하위 폴더에서만 미들웨어 적용
    // console.log("chats ONLY middleware");
  }
  if (!req.url.includes("/api")) {
    if (!req.url.includes("/enter") && !req.cookies.get("carrotsession")) {
      return NextResponse.redirect(new URL("/enter", req.url));
    }
  }

  return NextResponse.next();
}
