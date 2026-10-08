'use server';

import { prisma } from '@/lib/db';
import { getAuthenticatedUserId } from '@/lib/actions/auth-actions';

export type SearchResults = {
    journals: any[];
};

export async function searchAll(query: string): Promise<SearchResults> {
    const userId = await getAuthenticatedUserId();
    if (!userId || !query || query.length < 2) {
        return { journals: [] };
    }

    const journals = await prisma.journalEntry.findMany({
        where: {
            userId,
            OR: [
                { title: { contains: query } },
                { content: { contains: query } }
            ]
        },
        take: 10,
        orderBy: { createdAt: 'desc' }
    });

    return { journals };
}
