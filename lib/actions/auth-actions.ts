'use server';

import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth-utils';

// --- Helper: Centralized Auth Check ---
export async function getAuthenticatedUserId(): Promise<string | undefined> {
    try {
        // 1. Try NextAuth
        const session = await auth();
        if (session?.user?.id) {
            console.log('[Auth] Found NextAuth session user:', session.user.id);
            return session.user.id;
        }

        // 2. Try Custom JWT from Cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (token) {
            const payload = await verifyJWT(token);
            if (payload?.userId) {
                console.log('[Auth] Verified JWT token for user:', payload.userId);
                return payload.userId as string;
            } else {
                console.warn('[Auth] Token present but verification failed or missing userId');
            }
        } else {
            console.warn('[Auth] No auth-token cookie found');
        }

    } catch (error) {
        console.error('[Auth] Error during authentication check:', error);
    }
    return undefined;
}
