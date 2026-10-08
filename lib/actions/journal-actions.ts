'use server';

import { prisma } from '@/lib/db';
import { getAuthenticatedUserId } from '@/lib/actions/auth-actions';

export async function getRecentJournalEntries(limit = 5) {
    const userId = await getAuthenticatedUserId();
    if (!userId) return [];

    try {
        const entries = await prisma.journalEntry.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });
        return entries;
    } catch (error) {
        console.error("Failed to fetch journal entries:", error);
        return [];
    }
}
