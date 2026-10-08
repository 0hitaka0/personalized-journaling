'use server';

import { prisma } from '@/lib/db';
import { getAuthenticatedUserId } from '@/lib/actions/auth-actions';
import { startOfWeek, endOfWeek, subDays, format } from 'date-fns';

export interface LifeStreakAnalytics {
    entriesThisWeek: number;
    longestEntryStreak: number;
    avgMoodThisWeek: number | null;
    avgMoodLabel: string;
    reflectionDays: number;
    moodHistory: {
        date: string;
        value: number;
        label: string;
    }[];
}

const getMoodLabel = (val: number | null) => {
    if (!val) return 'No Data';
    if (val >= 9) return 'Ecstatic';
    if (val >= 8) return 'Great';
    if (val >= 7) return 'Good';
    if (val >= 5) return 'Okay';
    if (val >= 3) return 'Low';
    return 'Bad';
};

export async function getLifeStreakAnalytics(): Promise<LifeStreakAnalytics> {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
        return {
            entriesThisWeek: 0,
            longestEntryStreak: 0,
            avgMoodThisWeek: 0,
            avgMoodLabel: 'Neutral',
            reflectionDays: 0,
            moodHistory: []
        };
    }

    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });

    // 1. Mood Average within a week
    const moods = await prisma.mood.findMany({
        where: {
            userId,
            recordedAt: {
                gte: startOfCurrentWeek
            }
        },
        orderBy: {
            recordedAt: 'asc'
        }
    });

    let avgMood: number | null = null;
    if (moods.length > 0) {
        const sum = moods.reduce((acc, m) => acc + m.moodValue, 0);
        avgMood = Math.round((sum / moods.length) * 10) / 10;
    }

    // 2. Journal entries this week + reflection days + writing streak
    const journalEntries = await prisma.journalEntry.findMany({
        where: {
            userId,
            isArchived: false,
            deletedAt: null
        },
        select: {
            createdAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const entriesThisWeek = journalEntries.filter(
        e => e.createdAt >= startOfCurrentWeek
    ).length;

    const dayKeys = new Set(
        journalEntries.map(e => format(e.createdAt, 'yyyy-MM-dd'))
    );

    const uniqueReflectionDays = new Set(
        journalEntries
            .filter(e => e.createdAt >= startOfCurrentWeek)
            .map(e => format(e.createdAt, 'yyyy-MM-dd'))
    ).size;

    // Longest run of consecutive days (ending today or earlier) with an entry
    let longestEntryStreak = 0;
    let currentStreak = 0;
    for (let i = 0; i < 365; i++) {
        const key = format(subDays(today, i), 'yyyy-MM-dd');
        if (dayKeys.has(key)) {
            currentStreak += 1;
            longestEntryStreak = Math.max(longestEntryStreak, currentStreak);
        } else {
            currentStreak = 0;
        }
    }

    // Formatted Mood History for Chart
    const moodHistory = moods.map(m => ({
        date: format(m.recordedAt, 'EEE'),
        value: m.moodValue,
        label: getMoodLabel(m.moodValue)
    }));

    return {
        entriesThisWeek,
        longestEntryStreak,
        avgMoodThisWeek: avgMood,
        avgMoodLabel: getMoodLabel(avgMood),
        reflectionDays: uniqueReflectionDays,
        moodHistory
    };
}
