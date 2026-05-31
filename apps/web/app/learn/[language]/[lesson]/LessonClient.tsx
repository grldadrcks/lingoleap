"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { courses, shouldIncrementStreak } from "@lingo/shared";
import type { Language, QuizQuestion } from "@lingo/shared";

type Phase = "vocab" | "quiz" | "complete";

const LANG_CODES: Record<Language, string> = {
  spanish: "es-ES",
  mandarin: "zh-CN",
  french: "fr-FR",
  japanese: "ja-JP",
  korean: "ko-KR",
};

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
  const [autoSpeak, setAutoSpeak] = useState(true);

  useEffect(() => {
    if (!course || !lesson) router.push("/dashboard");
  }, [course, lesson, router]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = LANG_CODES[language] ?? "en-US";
    utt.rate = 0.8;
    window.speechSynthesis.speak(utt);
  }, [language]);

  // Auto-speak word when card changes
  useEffect(() => {
    if (phase === "vocab" && autoSpeak && lesson) {
      speak(lesson.words[wordIndex].word);
    }
  }, [wordIndex, phase, autoSpeak, lesson, speak]);

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

  // ── Complete ──────────────────────────────────────────────────────
  if (phase === "complete") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-5">
        <span className="text-6xl">🎉</span>
        <h1 className="text-2xl font-bold">Lesson Complete!</h1>
        <p className="text-slate-500">You scored {score}/{lesson.quiz.length} on the quiz.</p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href={`/learn/${language}`} className="px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors text-sm">
            Next Lesson
          </Link>
          <Link href="/dashboard" className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm">
            Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // ── Vocab ─────────────────────────────────────────────────────────
  if (phase === "vocab") {
    return (
      <main className="min-h-screen flex flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <Link href={`/learn/${language}`} className="text-slate-500 text-sm">← Back</Link>
          <span className="font-semibold text-sm truncate px-2">{lesson.title}</span>
          <button
            onClick={() => setAutoSpeak((v) => !v)}
            className={`text-lg px-2 py-1 rounded-lg transition-colors ${autoSpeak ? "text-emerald-500" : "text-slate-300"}`}
            title={autoSpeak ? "Auto-speak on" : "Auto-speak off"}
          >
            🔊
          </button>
        </nav>

        <div className="flex-1 flex flex-col px-4 py-4 gap-4 max-w-lg mx-auto w-full">
          {/* Progress bar */}
          <div className="flex gap-1">
            {lesson.words.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= wordIndex ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`} />
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center">Word {wordIndex + 1} of {lesson.words.length}</p>

          {/* Word card */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 gap-3 items-center justify-center text-center min-h-0">
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl font-bold break-words max-w-full leading-tight">
                {currentWord.word}
              </span>
              <button
                onClick={() => speak(currentWord.word)}
                className="text-xl text-emerald-400 hover:text-emerald-600 shrink-0"
                title="Pronounce"
              >
                🔊
              </button>
            </div>
            <span className="text-slate-400 text-sm italic break-words max-w-full">{currentWord.pronunciation}</span>
            <span className="text-lg font-semibold text-slate-700 dark:text-slate-200 break-words max-w-full">{currentWord.translation}</span>

            {currentWord.example && (
              <div className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-left">
                <p className="text-sm font-medium italic text-slate-600 dark:text-slate-300 break-words">
                  &ldquo;{currentWord.example}&rdquo;
                </p>
                <p className="text-xs text-slate-400 mt-1 break-words">{currentWord.exampleTranslation}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (wordIndex + 1 < lesson.words.length) setWordIndex((i) => i + 1);
              else setPhase("quiz");
            }}
            className="py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors shrink-0"
          >
            {wordIndex + 1 < lesson.words.length ? "Next word →" : "Start quiz →"}
          </button>
        </div>
      </main>
    );
  }

  // ── Quiz ──────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <span className="font-semibold text-sm truncate">{lesson.title} — Quiz</span>
      </nav>

      <div className="flex-1 flex flex-col px-4 py-4 gap-4 max-w-lg mx-auto w-full">
        {/* Progress bar */}
        <div className="flex gap-1">
          {lesson.quiz.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full ${i < quizIndex ? "bg-emerald-500" : i === quizIndex ? "bg-emerald-300" : "bg-slate-200 dark:bg-slate-700"}`} />
          ))}
        </div>
        <p className="text-xs text-slate-400 text-center">Question {quizIndex + 1} of {lesson.quiz.length}</p>

        {/* Question card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-base font-semibold text-center mb-4 break-words">{currentQuestion.question}</p>
          <div className="flex flex-col gap-2">
            {currentQuestion.options.map((opt, i) => {
              let style = "border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20";
              if (selected !== null) {
                if (i === currentQuestion.correctIndex) style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300";
                else if (i === selected) style = "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
                else style = "border-slate-200 dark:border-slate-700 opacity-40";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`p-3 rounded-xl border-2 text-left text-sm font-medium transition-all break-words ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {selected !== null && (
          <button
            onClick={nextQuestion}
            disabled={saving}
            className="py-4 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-60 shrink-0"
          >
            {quizIndex + 1 < lesson.quiz.length ? "Next question →" : saving ? "Saving…" : "Finish lesson →"}
          </button>
        )}
      </div>
    </main>
  );
}
