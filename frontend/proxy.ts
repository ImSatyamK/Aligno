import { NextRequest, NextResponse } from "next/server";

const unprotectedRoutes = ["/login", "/signup"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtectedRoute = !(unprotectedRoutes.some((route) => pathname.startsWith(route)));
    const token = request.cookies.has("jwt");

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    } else {
        if (token) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login", "/signup"],
};