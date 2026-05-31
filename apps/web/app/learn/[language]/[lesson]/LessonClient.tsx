"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { courses, shouldIncrementStreak, calcXp, checkNewBadges, BADGES } from "@lingo/shared";
import type { Language, QuizQuestion } from "@lingo/shared";

type Phase = "vocab" | "quiz" | "complete";

const LANG_CODES: Record<Language, string> = {
  spanish: "es-ES",
  mandarin: "zh-CN",
  french: "fr-FR",
  japanese: "ja-JP",
  korean: "ko-KR",
};

const MAX_HEARTS = 5;
const SAVE_KEY = (lang: string, lesson: string) => `lingoleap_progress_${lang}_${lesson}`;

async function speakText(text: string, langCode: string) {
  try {
    // @ts-ignore
    const { TextToSpeech } = await import("@capacitor-community/text-to-speech");
    await TextToSpeech.speak({ text, lang: langCode, rate: 0.8, volume: 1.0, pitch: 1.0 });
  } catch {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = langCode;
      utt.rate = 0.8;
      window.speechSynthesis.speak(utt);
    }
  }
}

async function haptic(type: "light" | "error" | "success") {
  try {
    // @ts-ignore
    const { Haptics, ImpactStyle, NotificationType } = await import("@capacitor/haptics");
    if (type === "light") await Haptics.impact({ style: ImpactStyle.Light });
    else if (type === "error") await Haptics.notification({ type: NotificationType.Error });
    else await Haptics.notification({ type: NotificationType.Success });
  } catch {}
}

async function triggerConfetti() {
  try {
    const confetti = (await import("canvas-confetti")).default;
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#10b981", "#0d9488", "#34d399", "#fbbf24"] });
  } catch {}
}

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
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [saving, setSaving] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);
  const saveKeyRef = useRef(SAVE_KEY(language, lessonId));

  useEffect(() => {
    if (!course || !lesson) router.push("/dashboard");
  }, [course, lesson, router]);

  // Restore auto-save
  useEffect(() => {
    if (!lesson) return;
    const saved = localStorage.getItem(saveKeyRef.current);
    if (saved) {
      try {
        const { quizIndex: qi, score: sc, hearts: h, phase: ph } = JSON.parse(saved);
        if (ph === "quiz") { setPhase("quiz"); setQuizIndex(qi); setScore(sc); setHearts(h); }
      } catch {}
    }
  }, [lesson]);

  // Auto-save quiz state
  useEffect(() => {
    if (phase === "quiz" && lesson) {
      localStorage.setItem(saveKeyRef.current, JSON.stringify({ quizIndex, score, hearts, phase }));
    }
    if (phase === "complete") localStorage.removeItem(saveKeyRef.current);
  }, [quizIndex, score, hearts, phase, lesson]);

  const speak = useCallback((text: string) => {
    speakText(text, LANG_CODES[language] ?? "en-US");
  }, [language]);

  // Auto-speak word when card changes
  useEffect(() => {
    if (phase === "vocab" && autoSpeak && lesson) speak(lesson.words[wordIndex].word);
  }, [wordIndex, phase, autoSpeak, lesson, speak]);

  // Auto-speak listening quiz word
  useEffect(() => {
    if (phase === "quiz" && lesson) {
      const q = lesson.quiz[quizIndex];
      if (q?.type === "listening" && q.listenWord) speak(q.listenWord);
    }
  }, [quizIndex, phase, lesson, speak]);

  if (!course || !lesson) return null;

  const currentWord = lesson.words[wordIndex];
  const currentQuestion: QuizQuestion = lesson.quiz[quizIndex];

  function animateNext(fn: () => void) {
    setCardVisible(false);
    setTimeout(() => { fn(); setCardVisible(true); }, 180);
  }

  function handleAnswer(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === currentQuestion.correctIndex;
    if (correct) {
      setScore((s) => s + 1);
      haptic("light");
    } else {
      setHearts((h) => Math.max(0, h - 1));
      haptic("error");
    }
  }

  function nextQuestion() {
    setSelected(null);
    if (quizIndex + 1 < lesson!.quiz.length) {
      animateNext(() => setQuizIndex((q) => q + 1));
    } else {
      handleComplete();
    }
  }

  async function handleComplete() {
    setSaving(true);
    const xp = calcXp(score, lesson!.quiz.length);
    setXpEarned(xp);
    haptic("success");
    triggerConfetti();

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("user_progress").upsert({
        user_id: user.id, language, lesson_id: lessonId,
        completed: true, score, xp_earned: xp,
      }, { onConflict: "user_id,language,lesson_id" });

      const { data: prof } = await supabase
        .from("profiles")
        .select("current_streak, longest_streak, last_active_date, xp_total")
        .eq("id", user.id)
        .single();

      if (prof) {
        const newXpTotal = (prof.xp_total ?? 0) + xp;
        const updates: Record<string, unknown> = { xp_total: newXpTotal };
        if (shouldIncrementStreak(prof.last_active_date)) {
          const newStreak = prof.current_streak + 1;
          updates.current_streak = newStreak;
          updates.longest_streak = Math.max(newStreak, prof.longest_streak);
          updates.last_active_date = new Date().toISOString();
        }
        await supabase.from("profiles").update(updates).eq("id", user.id);

        // Check badges
        const { data: allProgress } = await supabase
          .from("user_progress").select("language, lesson_id").eq("user_id", user.id).eq("completed", true);
        const { data: existingBadges } = await supabase
          .from("user_badges").select("badge_id").eq("user_id", user.id);
        const existingIds = (existingBadges ?? []).map((b: { badge_id: string }) => b.badge_id);
        const langs = new Set((allProgress ?? []).map((p: { language: string }) => p.language));
        const langLessons = (allProgress ?? []).filter((p: { language: string }) => p.language === language);
        const earned = checkNewBadges({
          totalCompleted: (allProgress ?? []).length,
          perfectScoreThisLesson: score === lesson!.quiz.length,
          streak: updates.current_streak as number ?? prof.current_streak,
          languagesWithLessons: langs.size,
          completedAllInLanguage: langLessons.length >= course.lessons.length,
          xpTotal: newXpTotal,
          existingBadgeIds: existingIds,
        });
        if (earned.length > 0) {
          await supabase.from("user_badges").insert(earned.map((id) => ({ user_id: user.id, badge_id: id })));
          setNewBadges(earned);
        }
      }
    }
    setSaving(false);
    setPhase("complete");
  }

  // ── Complete ──────────────────────────────────────────────────────
  if (phase === "complete") {
    const isPerfect = score === lesson.quiz.length;
    const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
    const nextLesson = course.lessons[lessonIndex + 1] ?? null;
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-5">
        <span className="text-6xl">{isPerfect ? "🌟" : "🎉"}</span>
        <h1 className="text-2xl font-bold">Lesson Complete!</h1>
        <p className="text-slate-500">You scored {score}/{lesson.quiz.length} on the quiz.</p>
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl px-4 py-2">
          <span className="text-emerald-500 font-bold text-lg">+{xpEarned} XP</span>
          {isPerfect && <span className="text-xs text-emerald-400">(perfect bonus!)</span>}
        </div>

        {newBadges.length > 0 && (
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <p className="text-sm font-semibold text-amber-500">New badges earned!</p>
            {newBadges.map((id) => {
              const b = BADGES.find((b) => b.id === id);
              return b ? (
                <div key={id} className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-2">
                  <span className="text-2xl">{b.icon}</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{b.name}</p>
                    <p className="text-xs text-slate-500">{b.description}</p>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        )}

        <div className="flex gap-3 flex-wrap justify-center">
          {nextLesson ? (
            <Link
              href={`/learn/${language}/${nextLesson.id}`}
              className="px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors text-sm"
            >
              Next: {nextLesson.title} →
            </Link>
          ) : (
            <Link
              href={`/learn/${language}`}
              className="px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors text-sm"
            >
              All lessons done! 🏆
            </Link>
          )}
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
        <nav className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <Link href={`/learn/${language}`} className="text-slate-500 text-sm">← Back</Link>
          <span className="font-semibold text-sm truncate px-2">{lesson.title}</span>
          <button
            onClick={() => setAutoSpeak((v) => !v)}
            className={`text-lg px-2 py-1 rounded-lg transition-colors ${autoSpeak ? "text-emerald-500" : "text-slate-300"}`}
            title={autoSpeak ? "Auto-speak on" : "Auto-speak off"}
          >🔊</button>
        </nav>

        <div className="flex-1 flex flex-col px-4 py-4 gap-4 max-w-lg mx-auto w-full">
          <div className="flex gap-1">
            {lesson.words.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= wordIndex ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`} />
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center">Word {wordIndex + 1} of {lesson.words.length}</p>

          <div
            className="flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 gap-3 items-center justify-center text-center min-h-0 transition-opacity duration-150"
            style={{ opacity: cardVisible ? 1 : 0 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl font-bold break-words max-w-full leading-tight">{currentWord.word}</span>
              <button onClick={() => speak(currentWord.word)} className="text-xl text-emerald-400 hover:text-emerald-600 shrink-0" title="Pronounce">🔊</button>
            </div>
            <span className="text-slate-400 text-sm italic break-words max-w-full">{currentWord.pronunciation}</span>
            <span className="text-lg font-semibold text-slate-700 dark:text-slate-200 break-words max-w-full">{currentWord.translation}</span>
            {currentWord.example && (
              <div className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-left">
                <p className="text-sm font-medium italic text-slate-600 dark:text-slate-300 break-words">&ldquo;{currentWord.example}&rdquo;</p>
                <p className="text-xs text-slate-400 mt-1 break-words">{currentWord.exampleTranslation}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (wordIndex + 1 < lesson.words.length) animateNext(() => setWordIndex((i) => i + 1));
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
  const isListening = currentQuestion.type === "listening";
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <span className="font-semibold text-sm truncate">{lesson.title} — Quiz</span>
        <div className="flex gap-1">
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <span key={i} className={`text-base transition-all ${i < hearts ? "opacity-100" : "opacity-20"}`}>❤️</span>
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col px-4 py-4 gap-4 max-w-lg mx-auto w-full">
        <div className="flex gap-1">
          {lesson.quiz.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i < quizIndex ? "bg-emerald-500" : i === quizIndex ? "bg-emerald-300" : "bg-slate-200 dark:bg-slate-700"}`} />
          ))}
        </div>
        <p className="text-xs text-slate-400 text-center">Question {quizIndex + 1} of {lesson.quiz.length}</p>

        <div
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 transition-opacity duration-150"
          style={{ opacity: cardVisible ? 1 : 0 }}
        >
          {isListening ? (
            <div className="flex flex-col items-center gap-3 mb-4">
              <p className="text-sm text-slate-500 text-center">Listen and choose the correct meaning</p>
              <button
                onClick={() => speak(currentQuestion.listenWord ?? "")}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-3xl flex items-center justify-center transition-colors shadow-md active:scale-95"
              >🔊</button>
            </div>
          ) : (
            <p className="text-base font-semibold text-center mb-4 break-words">{currentQuestion.question}</p>
          )}

          <div className="flex flex-col gap-2">
            {currentQuestion.options.map((opt, i) => {
              let style = "border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20";
              if (selected !== null) {
                if (i === currentQuestion.correctIndex) style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300";
                else if (i === selected) style = "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
                else style = "border-slate-200 dark:border-slate-700 opacity-40";
              }
              return (
                <button key={i} onClick={() => handleAnswer(i)} className={`p-3 rounded-xl border-2 text-left text-sm font-medium transition-all break-words ${style}`}>
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
