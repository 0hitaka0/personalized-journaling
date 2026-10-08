import { Suspense } from 'react';
import { DashboardContent } from './components/dashboard-content';
import { Loader2 } from 'lucide-react';
import { getRecentJournalEntries } from '@/lib/actions/journal-actions';
import { getLifeStreakAnalytics } from '@/lib/actions/analytics-actions';

// Ensure this is a server component
export const dynamic = 'force-dynamic';

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Fetch Data in Parallel
    const [entries, analytics] = await Promise.all([
        getRecentJournalEntries(5),
        getLifeStreakAnalytics()
    ]);

    // Handle search params safely
    const resolvedParams = await searchParams;
    const showWelcome = resolvedParams?.welcome === 'true';

    return (
        <Suspense fallback={
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        }>
            <DashboardContent
                initialEntries={entries}
                lifeStreak={analytics}
                showWelcome={showWelcome}
            />
        </Suspense>
    );
}
