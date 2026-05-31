"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { courses, shouldIncrementStreak } from "@lingo/shared";
import type { Language, QuizQuestion } from "@lingo/shared";

type Phase = "vocab" | "quiz" | "complete";

export default function LessonClient() {
  const params = useParams();
  const router = useRouter();
  const language = params.language as Language;
  const lessonId = params.lesson as string;

  const course = courses[language];
  const lesson = course?.lessons.find((l) => l.id === lessonId);

  const [phase, setPhase] = useState<Phase>("vocab");
  const [wordIndex, setWordIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!course || !lesson) router.push("/dashboard");
  }, [course, lesson, router]);

  if (!course || !lesson) return null;

  const currentWord = lesson.words[wordIndex];
  const currentQuestion: QuizQuestion = lesson.quiz[quizIndex];

  function handleAnswer(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === currentQuestion.correctIndex) setScore((s) => s + 1);
  }

  function nextQuestion() {
    setSelected(null);
    if (quizIndex + 1 < lesson!.quiz.length) {
      setQuizIndex((q) => q + 1);
    } else {
      handleComplete();
    }
  }

  async function handleComplete() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("user_progress").upsert({
        user_id: user.id,
        language,
        lesson_id: lessonId,
        completed: true,
        score,
      }, { onConflict: "user_id,language,lesson_id" });

      const { data: prof } = await supabase
        .from("profiles")
        .select("current_streak, longest_streak, last_active_date")
        .eq("id", user.id)
        .single();

      if (prof && shouldIncrementStreak(prof.last_active_date)) {
        const newStreak = prof.current_streak + 1;
        await supabase.from("profiles").update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, prof.longest_streak),
          last_active_date: new Date().toISOString(),
        }).eq("id", user.id);
      }
    }
    setSaving(false);
    setPhase("complete");
  }

  if (phase === "complete") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6">
        <span className="text-7xl">🎉</span>
        <h1 className="text-3xl font-bold">Lesson Complete!</h1>
        <p className="text-slate-500 text-lg">You scored {score}/{lesson.quiz.length} on the quiz.</p>
        <div className="flex gap-4">
          <Link href={`/learn/${language}`} className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors">
            Next Lesson
          </Link>
          <Link href="/dashboard" className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (phase === "vocab") {
    return (
      <main className="min-h-screen flex flex-col">
        <nav className="flex items-center gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Link href={`/learn/${language}`} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm">
            ← Back
          </Link>
          <span className="font-semibold">{lesson.title}</span>
        </nav>
        <div className="max-w-lg mx-auto w-full px-6 py-10 flex flex-col gap-6">
          <div className="flex gap-1">
            {lesson.words.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= wordIndex ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`} />
            ))}
          </div>
          <p className="text-sm text-slate-500 text-center">Word {wordIndex + 1} of {lesson.words.length}</p>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-10 flex flex-col items-center gap-4 text-center">
            <span className="text-5xl font-bold">{currentWord.word}</span>
            <span className="text-slate-400 text-lg italic">{currentWord.pronunciation}</span>
            <span className="text-2xl text-slate-600 dark:text-slate-300">{currentWord.translation}</span>
            {currentWord.example && (
              <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm">
                <p className="font-medium italic">&ldquo;{currentWord.example}&rdquo;</p>
                <p className="text-slate-500 mt-1">{currentWord.exampleTranslation}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              if (wordIndex + 1 < lesson.words.length) setWordIndex((i) => i + 1);
              else setPhase("quiz");
            }}
            className="py-4 rounded-xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition-colors"
          >
            {wordIndex + 1 < lesson.words.length ? "Next word →" : "Start quiz →"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="flex items-center gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <span className="font-semibold">{lesson.title} — Quiz</span>
      </nav>
      <div className="max-w-lg mx-auto w-full px-6 py-10 flex flex-col gap-6">
        <div className="flex gap-1">
          {lesson.quiz.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full ${i < quizIndex ? "bg-emerald-500" : i === quizIndex ? "bg-emerald-300" : "bg-slate-200 dark:bg-slate-700"}`} />
          ))}
        </div>
        <p className="text-sm text-slate-500 text-center">Question {quizIndex + 1} of {lesson.quiz.length}</p>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <p className="text-xl font-semibold text-center mb-6">{currentQuestion.question}</p>
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((opt, i) => {
              let style = "border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20";
              if (selected !== null) {
                if (i === currentQuestion.correctIndex) style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300";
                else if (i === selected) style = "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
                else style = "border-slate-200 dark:border-slate-700 opacity-50";
              }
              return (
                <button key={i} onClick={() => handleAnswer(i)} className={`p-4 rounded-xl border-2 text-left font-medium transition-all ${style}`}>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
        {selected !== null && (
          <button onClick={nextQuestion} disabled={saving} className="py-4 rounded-xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition-colors disabled:opacity-60">
            {quizIndex + 1 < lesson.quiz.length ? "Next question →" : saving ? "Saving…" : "Finish lesson →"}
          </button>
        )}
      </div>
    </main>
  );
}
