"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { courses, getStreakMessage, getLevel, getLevelTitle, getXpForNextLevel, DAILY_XP_GOAL, BADGES } from "@lingo/shared";
import type { Language } from "@lingo/shared";

interface Profile {
  username: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  xp_total: number;
}

interface Progress {
  language: string;
  lesson_id: string;
  xp_earned: number;
  completed_at: string;
}

interface UserBadge {
  badge_id: string;
}

const languages = Object.entries(courses).map(([key, course]) => ({
  key: key as Language,
  flag: course.flag,
  name: course.displayName,
  totalLessons: course.lessons.length,
}));

function XpRing({ current, needed }: { current: number; needed: number }) {
  const pct = Math.min(current / needed, 1);
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke="white" strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x="36" y="40" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">{Math.round(pct * 100)}%</text>
    </svg>
  );
}

function DailyRing({ todayXp, goal }: { todayXp: number; goal: number }) {
  const pct = Math.min(todayXp / goal, 1);
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const done = todayXp >= goal;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" className="dark:opacity-20" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={done ? "#10b981" : "#34d399"} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        <text x="28" y="33" textAnchor="middle" fill={done ? "#10b981" : "#64748b"} fontSize="11" fontWeight="bold">
          {done ? "✓" : `${todayXp}`}
        </text>
      </svg>
      <p className="text-xs text-slate-500">Daily goal</p>
      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{todayXp}/{goal} XP</p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const [{ data: prof }, { data: prog }, { data: bdg }] = await Promise.all([
        supabase.from("profiles").select("username, current_streak, longest_streak, last_active_date, xp_total").eq("id", user.id).single(),
        supabase.from("user_progress").select("language, lesson_id, xp_earned, completed_at").eq("user_id", user.id).eq("completed", true),
        supabase.from("user_badges").select("badge_id").eq("user_id", user.id),
      ]);

      setProfile(prof);
      setProgress(prog ?? []);
      setBadges(bdg ?? []);
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
  const xpTotal = profile?.xp_total ?? 0;
  const level = getLevel(xpTotal);
  const levelTitle = getLevelTitle(level);
  const { current: levelXp, needed: levelNeeded } = getXpForNextLevel(xpTotal);

  const today = new Date().toDateString();
  const todayXp = progress
    .filter((p) => new Date(p.completed_at).toDateString() === today)
    .reduce((sum, p) => sum + (p.xp_earned ?? 0), 0);

  const earnedBadgeIds = new Set(badges.map((b) => b.badge_id));

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <span className="text-xl font-bold text-emerald-500">LingoLeap</span>
        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-sm hidden sm:block">Hi, {profile?.username}</span>
          <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Log out</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-6">

        {/* Streak + XP card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-5 text-white overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-emerald-100 text-xs font-medium">Current Streak</p>
              <p className="text-4xl font-bold mt-0.5">{streak} 🔥</p>
              <p className="text-emerald-100 mt-1 text-xs">{getStreakMessage(streak)}</p>
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <XpRing current={levelXp} needed={levelNeeded} />
              <p className="text-xs text-emerald-100">Lv.{level} {levelTitle}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-emerald-100 text-xs">Total XP</p>
              <p className="text-2xl font-bold">{xpTotal}</p>
              <p className="text-emerald-100 text-xs">Best: {profile?.longest_streak ?? 0}d</p>
            </div>
          </div>
        </div>

        {/* Daily goal */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4">
          <DailyRing todayXp={todayXp} goal={DAILY_XP_GOAL} />
          <div>
            <p className="font-semibold text-sm">Daily Goal</p>
            <p className="text-xs text-slate-500 mt-0.5">Earn {DAILY_XP_GOAL} XP today to keep your streak</p>
            {todayXp >= DAILY_XP_GOAL && <p className="text-xs text-emerald-500 font-medium mt-1">Goal reached!</p>}
          </div>
        </div>

        {/* Languages */}
        <div>
          <h2 className="text-lg font-bold mb-3">Your Languages</h2>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => {
              const completed = progress.filter((p) => p.language === lang.key).length;
              const pct = Math.round((completed / lang.totalLessons) * 100);
              return (
                <Link
                  key={lang.key}
                  href={`/learn/${lang.key}`}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-2 hover:shadow-md hover:border-emerald-300 transition-all min-w-0"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-2xl shrink-0">{lang.flag}</span>
                    <span className="font-semibold text-sm truncate">{lang.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{completed}/{lang.totalLessons}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-lg font-bold mb-3">Badges</h2>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((badge) => {
              const earned = earnedBadgeIds.has(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl border p-3 flex flex-col items-center gap-1.5 text-center transition-all ${
                    earned
                      ? "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700"
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-40"
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <p className="text-xs font-semibold leading-tight">{badge.name}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
