"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getStreakMessage, shouldIncrementStreak } from "@lingo/shared";

interface Profile {
  username: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

interface Progress {
  language: string;
  lesson_id: string;
}

const languages = [
  { key: "spanish", flag: "🇪🇸", name: "Spanish", totalLessons: 3 },
  { key: "mandarin", flag: "🇨🇳", name: "Mandarin", totalLessons: 3 },
  { key: "french", flag: "🇫🇷", name: "French", totalLessons: 3 },
  { key: "japanese", flag: "🇯🇵", name: "Japanese", totalLessons: 3 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { data: prof } = await supabase
        .from("profiles")
        .select("username, current_streak, longest_streak, last_active_date")
        .eq("id", user.id)
        .single();

      const { data: prog } = await supabase
        .from("user_progress")
        .select("language, lesson_id")
        .eq("user_id", user.id)
        .eq("completed", true);

      setProfile(prof);
      setProgress(prog ?? []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400 text-lg">Loading…</div>
      </main>
    );
  }

  const streak = profile?.current_streak ?? 0;

  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <span className="text-2xl font-bold text-emerald-500">LingoLeap</span>
        <div className="flex items-center gap-4">
          <span className="text-slate-500 text-sm">Hi, {profile?.username}</span>
          <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            Log out
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
        {/* Streak Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium">Current Streak</p>
            <p className="text-5xl font-bold mt-1">{streak} 🔥</p>
            <p className="text-emerald-100 mt-2">{getStreakMessage(streak)}</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-100 text-sm">Best streak</p>
            <p className="text-2xl font-bold">{profile?.longest_streak ?? 0} days</p>
          </div>
        </div>

        {/* Languages */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Languages</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {languages.map((lang) => {
              const completed = progress.filter((p) => p.language === lang.key).length;
              const pct = Math.round((completed / lang.totalLessons) * 100);
              return (
                <Link
                  key={lang.key}
                  href={`/learn/${lang.key}`}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-3 hover:shadow-md hover:border-emerald-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{lang.flag}</span>
                    <span className="font-semibold text-lg">{lang.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>{completed}/{lang.totalLessons} lessons</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
