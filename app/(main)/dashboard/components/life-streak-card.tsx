'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PenLine, Flame, Brain, Smile } from 'lucide-react';
import { LifeStreakAnalytics } from '@/lib/actions/analytics-actions';
import { cn } from '@/lib/utils';
import { useMBTI } from '@/components/providers/mbti-provider';
import { MBTIType } from '@/lib/mbti-data';

interface LifeStreakCardProps {
    data: LifeStreakAnalytics;
}

export function LifeStreakCard({ data }: LifeStreakCardProps) {
    const { type } = useMBTI();
    // Default purple if not loaded
    const userType = type as MBTIType;

    const metrics = [
        {
            label: 'Entries This Week',
            value: `${data.entriesThisWeek}`,
            subtext: 'journal entries written',
            icon: PenLine,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20'
        },
        {
            label: 'Mental Clarity',
            value: `${data.reflectionDays}/7`,
            subtext: 'days reflected',
            icon: Brain,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20'
        },
        {
            label: 'Writing Streak',
            value: `${data.longestEntryStreak}`,
            subtext: 'days best streak',
            icon: Flame,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            borderColor: 'border-orange-500/20'
        },
        {
            label: 'Mood Harmony',
            value: data.avgMoodThisWeek ? data.avgMoodThisWeek.toString() : '-',
            subtext: data.avgMoodLabel,
            icon: Smile,
            color: 'text-pink-400',
            bg: 'bg-pink-500/10',
            borderColor: 'border-pink-500/20'
        }
    ];

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Life Streak Analytics</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {metrics.map((metric, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                            "p-4 rounded-xl border backdrop-blur-sm transition-all relative overflow-hidden group",
                            "bg-slate-900/40 border-white/5",
                            "hover:border-opacity-50",
                            metric.borderColor
                        )}
                    >
                        <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity", metric.bg.replace('/10', '/30'))} />

                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <div className={cn("p-2 rounded-lg", metric.bg, metric.color)}>
                                <metric.icon className="w-4 h-4" />
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="text-2xl font-bold text-white mb-0.5">{metric.value}</div>
                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">{metric.label}</div>
                            <div className="text-xs text-slate-400">{metric.subtext}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Chart Visualization for Mood if data exists */}
            {data.moodHistory.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-slate-900/40 border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-medium text-slate-400">Weekly Flow</span>
                        <span className="text-[10px] text-slate-600 bg-white/5 px-2 py-1 rounded-full">Last 7 Days</span>
                    </div>
                    <div className="h-16 flex items-end justify-between gap-1">
                        {data.moodHistory.map((m, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 flex-1 group">
                                <div
                                    className="w-full rounded-t-sm bg-gradient-to-t from-purple-500/20 to-indigo-500/40 hover:from-purple-500/40 hover:to-indigo-500/60 transition-all relative"
                                    style={{ height: `${m.value * 10}%` }}
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                        {m.value}/10
                                    </div>
                                </div>
                                <span className="text-[9px] uppercase text-slate-600 font-medium">{m.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
