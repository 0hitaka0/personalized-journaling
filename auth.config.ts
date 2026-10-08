import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "openid email profile",
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    // We force JWT strategy for edge compatibility
    session: { strategy: "jwt" },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                // In JWT strategy, user ID comes from token.sub
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (account) {
                // Persist the OAuth access_token to the token right after signin
                token.accessToken = account.access_token
            }
            return token
        }
    },
} satisfies NextAuthConfig
