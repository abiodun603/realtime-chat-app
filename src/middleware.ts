import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleare(req) {
    const pathname = req.nextUrl.pathname

    // Manage route protection
    const isAuth = await getToken({ req })
    const isLoginPage = pathname.startsWith("/login")

    const sensitiveRoutes = ["/dashboard"]
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) => pathname.startsWith(route))

    if(isLoginPage){
      // if(isAuth){
      //   return NextResponse.redirect(new URL("/dashboard", req.url))
      // }

      return NextResponse.next()
    }

    // if(!isAuth && isAccessingSensitiveRoute) {
    //   return NextResponse.redirect(new URL("/login", req.url))
    // }

    // if(pathname === "/"){
    //   return NextResponse.redirect(new URL("/dashboard", req.url))
    // }
  },{
    // this is done to handle redirect on auth page so that the middle function involved is always true, if we don't have that callback we will get an inifinite redirect, and a error message is the log tellling us that the page is redirecting us too often.
    callbacks: {
      async authorized() {
        return true
      }
    }
  }
)

export const config = {
  // matcher: ["/", "/login", "/dashboard/:path*"],
}