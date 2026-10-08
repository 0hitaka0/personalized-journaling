'use server';

import { prisma } from '@/lib/db';
import { getAuthenticatedUserId } from '@/lib/actions/auth-actions';
import { revalidatePath } from 'next/cache';

export interface MoodEntryData {
    value: number;
    emotions: string[];
    context: string[];
    notes?: string;
}

export async function saveMood(data: MoodEntryData) {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.mood.create({
            data: {
                userId,
                moodValue: data.value,
                emotions: JSON.stringify(data.emotions),
                context: JSON.stringify(data.context),
                notes: data.notes,
                recordedAt: new Date(),
            }
        });

        revalidatePath('/dashboard');
        revalidatePath('/api/insights'); // Ensure analytics update
        return { success: true };
    } catch (error) {
        console.error("Failed to save mood:", error);
        return { success: false, error: "Failed to save mood" };
    }
}
