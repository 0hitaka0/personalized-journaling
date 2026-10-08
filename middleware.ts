import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    // Define protected routes
    const protectedRoutes = ['/dashboard', '/journal', '/profile', '/settings'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Redirect to login if accessing protected route while not logged in
    if (isProtectedRoute && !isLoggedIn) {
        const url = new URL('/login', req.url);
        url.searchParams.set('callbackUrl', encodeURI(req.url));
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
