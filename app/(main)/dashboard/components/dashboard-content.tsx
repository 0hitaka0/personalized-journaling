'use client';

import React from 'react';
import { useAuth } from '@/components/auth-provider';
import { Loader2, PenLine, Sparkles, ArrowRight, Book } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea } from "@/components/ui/scroll-area";
import { PersonalizedGreeting } from '@/components/personalized-greeting';
import { TypeSpecificPrompt } from './type-specific-prompt';
import { MBTIType } from '@/lib/mbti-data';
import { DashboardMoodMeter } from './mood-meter';
import { useMBTI } from "@/components/providers/mbti-provider";
import { motion } from 'framer-motion';

import { LifeStreakCard } from './life-streak-card';
import { LifeStreakAnalytics } from '@/lib/actions/analytics-actions';

interface DashboardContentProps {
    initialEntries: any[];
    lifeStreak: LifeStreakAnalytics;
    showWelcome: boolean;
}

export function DashboardContent({ initialEntries, lifeStreak, showWelcome }: DashboardContentProps) {
    const { user, isLoading } = useAuth();
    const { type: mbtiType } = useMBTI();
    const userType = mbtiType as MBTIType | undefined;

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in">
                <PersonalizedGreeting
                    userType={userType}
                    userName={user?.name?.split(' ')[0] || 'Traveler'}
                    showWelcome={showWelcome}
                />

                <Link href="/journal/new">
                    <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-full transition-all shadow-lg shadow-purple-600/20 font-medium group border border-white/10">
                        <PenLine className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>New Entry</span>
                    </button>
                </Link>
            </div>

            <ScrollArea className="flex-1 -mr-4 pr-4">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-10"
                >
                    {/* Top Row: Daily Inspiration & Mood */}
                    <motion.div variants={item} className="lg:col-span-8 flex flex-col">
                        <section className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daily Inspiration</h2>
                            </div>
                            <TypeSpecificPrompt userType={userType} />
                        </section>
                    </motion.div>

                    <motion.div variants={item} className="lg:col-span-4 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mood Check-in</h2>
                        </div>
                        <DashboardMoodMeter />
                    </motion.div>

                    {/* Life Streak Analytics */}
                    <motion.div variants={item} className="lg:col-span-12">
                        <LifeStreakCard data={lifeStreak} />
                    </motion.div>

                    {/* Recent Journal Entries */}
                    <motion.div variants={item} className="lg:col-span-12 bg-slate-900/40 border border-white/5 rounded-2xl p-4 backdrop-blur-sm relative overflow-hidden group min-h-[300px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                                    <Book className="w-4 h-4" />
                                </div>
                                <h3 className="text-md font-medium text-white">Recent Entries</h3>
                            </div>
                            <Link href="/journal" className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1">
                                View All <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        <div className="space-y-2 relative z-10">
                            {initialEntries.length > 0 ? (
                                initialEntries.map((entry: any) => (
                                    <Link href={`/journal/${entry.id}`} key={entry.id} className="block group/entry">
                                        <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group-hover/entry:border-purple-500/20">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-medium text-slate-200 group-hover/entry:text-purple-300 transition-colors line-clamp-1">
                                                    {entry.title || 'Untitled Entry'}
                                                </h4>
                                                <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                                                    {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 line-clamp-1 mt-1 opacity-70">
                                                {entry.content?.replace(/<[^>]*>/g, '') || 'No content...'}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-500 text-xs">
                                    <p>No entries yet.</p>
                                    <Link href="/journal/new" className="text-purple-400 hover:underline mt-1 block">Write your first one?</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>

                </motion.div>
            </ScrollArea>
        </div>
    );
}
