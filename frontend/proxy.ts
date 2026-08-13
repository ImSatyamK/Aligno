import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/home"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const token = request.cookies.has("jwt");

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    } else {
        if (token) {
            return NextResponse.redirect(new URL("/home", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/home/:path*", "/", "/login", "/signup"],
};