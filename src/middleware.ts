import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl;

  const publicRoutes = ["/signin", "/signup", "/"];
  const protectedRoutes = ["/dashboard"];

 
  if (token && publicRoutes.includes(url.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

 
  if (!token && protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

 
  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/signup", "/", "/verify/:path*", "/dashboard/:path*"],
};
