import { getToken } from "next-auth/jwt";
import { NextResponse,NextRequest} from "next/server";
export { default } from "next-auth/middleware"

export async function middleware(req:NextRequest){
   const token = await getToken({req,secret:process.env.NEXTAUTH_SECRET})
   const url = req.nextUrl

   if(token && (url.pathname === "/signin" || url.pathname === "/signup" || url.pathname === "/")){
       return NextResponse.redirect(new URL("/dashboard",req.url))

   }

   return NextResponse.redirect(new URL("/home",req.url))
}

export const config = {
    matcher:[
        '/signin',
        '/signup',
        '/',
        '/verify/:path*',
        '/dashboard/:path*',
    ]
}