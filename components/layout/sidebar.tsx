"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Book,
  Settings,
  LogOut,
  Moon,
  Search,
  RefreshCw, // New
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MBTI_DATA, MBTIType } from "@/lib/mbti-data";

const sidebarItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Book,
    label: "Journal",
    href: "/journal",
  },
];
import { useMBTI } from "@/components/providers/mbti-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function Sidebar() {
  const pathname = usePathname();
  const { type, profile, setType } = useMBTI();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-black/60 backdrop-blur-xl transition-colors duration-500"
      style={{ borderColor: `${profile.theme.primary}30` }}>

      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b transition-colors duration-500"
        style={{ borderColor: `${profile.theme.primary}30` }}>
        <h1 className="text-xl font-light tracking-tighter text-slate-200 drop-shadow-sm">
          Reflections
        </h1>
        <span className="ml-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded text-black font-bold"
          style={{ backgroundColor: profile.theme.primary }}>
          {type}
        </span>
      </div>

      <div className="px-4 py-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search..."
            className="pl-8 bg-white/5 border-white/10 text-slate-300 placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-offset-0"
            style={{
              borderColor: `${profile.theme.primary}30`
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement;
                if (target.value.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(target.value)}`;
                }
              }
            }}
          />
        </div>
      </div>

      <div className="flex-1 space-y-1 px-3 py-2">
        <p className="px-3 text-xs font-medium text-slate-600 uppercase tracking-wider mb-2 mt-2">
          Workspace
        </p>

        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300",
                !isActive && "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              )}
              style={isActive ? {
                backgroundColor: `${profile.theme.primary}15`,
                color: profile.theme.primary,
                boxShadow: `0 0 15px -5px ${profile.theme.primary}40`,
                border: `1px solid ${profile.theme.primary}30`
              } : undefined}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        {/* Dynamic Prompts Section Removed - moved to Dashboard */}
      </div>

      <div className="border-t p-4 transition-colors duration-500"
        style={{ borderColor: `${profile.theme.primary}30` }}>

        <Link href="/settings" className="flex items-center gap-3 mb-4 px-2 w-full hover:bg-white/5 rounded-lg p-2 transition-colors text-left group">
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-lg transition-transform group-hover:scale-105"
            style={{ backgroundColor: profile.theme.primary }}>
            {type.substring(0, 2)}
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-sm text-slate-200 font-medium group-hover:text-white">{profile.name}</span>
            <span className="text-xs text-slate-600 flex items-center gap-1 group-hover:text-slate-400 transition-colors">
              Manage / Switch Type
              <Settings className="h-3 w-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </div>
        </Link>

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-900/50 hover:text-red-400 hover:bg-red-900/10 h-8 text-xs"
            onClick={() => {
              // Clear user-specific local storage to prevent data bleeding between sessions
              if (typeof window !== 'undefined') {
                localStorage.removeItem('clarity-mbti-type');
                localStorage.removeItem('user-profile');
                localStorage.removeItem('mbti-confirmed');
              }
              signOut({ callbackUrl: '/' });
            }}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
