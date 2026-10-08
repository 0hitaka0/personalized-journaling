import { StarsBackground } from "@/components/ui/stars-background";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black text-white p-8">
            <StarsBackground />

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Main</span>
            </Link>

            <div className="z-10 max-w-3xl space-y-12 animate-fade-in text-center">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500">
                        CLARITY
                    </h1>
                    <p className="text-xl text-slate-400 font-light max-w-xl mx-auto">
                        A personalized sanctuary for your mind, adapted to your cognitive style.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                    <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-white mb-2">MBTI-First</h3>
                        <p className="text-slate-400">
                            The entire application morphs to fit your personality type. From colors and layouts to writing prompts tuned to how you reflect.
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-white mb-2">Focus & Growth</h3>
                        <p className="text-slate-400">
                            Set goals and reflect on your days through guided journaling designed to help you find clarity in the chaos.
                        </p>
                    </div>
                </div>

                <div className="mt-12 p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4">Our Philosophy</h3>
                    <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto">
                        We believe that journaling shouldn't force you to think like a machine.
                        By understanding your cognitive functions—how you perceive the world and make
                        decisions—REFLECTIONS creates an environment where your natural strengths can thrive.
                    </p>
                </div>
            </div>
        </div>
    );
}
