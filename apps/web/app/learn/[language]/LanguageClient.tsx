"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { courses } from "@lingo/shared";
import type { Language } from "@lingo/shared";

export default function LanguageClient() {
  const params = useParams();
  const router = useRouter();
  const language = params.language as Language;
  const course = courses[language];
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!course) { router.push("/dashboard"); return; }
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      const { data } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("language", language)
        .eq("completed", true);
      setCompletedLessons((data ?? []).map((p) => p.lesson_id));
      setLoading(false);
    }
    load();
  }, [language, course, router]);

  if (!course || loading) return null;

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="flex items-center gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Link href="/dashboard" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm">
          ← Dashboard
        </Link>
        <span className="text-2xl font-bold text-emerald-500">LingoLeap</span>
      </nav>

      <div className="max-w-2xl mx-auto w-full px-6 py-10 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <span className="text-6xl">{course.flag}</span>
          <div>
            <h1 className="text-3xl font-bold">{course.displayName}</h1>
            <p className="text-slate-500">{course.lessons.length} lessons</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {course.lessons.map((lesson, i) => {
            const done = completedLessons.includes(lesson.id);
            const locked = i > 0 && !completedLessons.includes(course.lessons[i - 1].id);
            return (
              <Link
                key={lesson.id}
                href={locked ? "#" : `/learn/${language}/${lesson.id}`}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                  done
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700"
                    : locked
                    ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-emerald-300"
                }`}
                onClick={locked ? (e) => e.preventDefault() : undefined}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${done ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
                  {done ? "✓" : i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{lesson.title}</p>
                  <p className="text-sm text-slate-500">{lesson.description}</p>
                </div>
                {locked && <span className="text-xl">🔒</span>}
                {done && <span className="text-sm text-emerald-500 font-medium">Completed</span>}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
