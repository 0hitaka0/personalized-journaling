import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { MBTIProvider } from "@/components/providers/mbti-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from 'sonner';

// const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const outfit = { variable: "font-sans" }; // Mock

export const metadata: Metadata = {
  title: "Reflections | Personalized Journaling",
  description: "Personalized, MBTI-aware journaling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(outfit.variable, "font-sans min-h-screen bg-black text-slate-400 selection:bg-purple-500/30")}>
        <AuthProvider>
          <MBTIProvider>
            {children}
            <Toaster position="bottom-right" theme="dark" />
          </MBTIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
