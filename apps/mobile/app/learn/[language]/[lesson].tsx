import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { courses, shouldIncrementStreak } from '@lingo/shared';
import type { Language, QuizQuestion } from '@lingo/shared';

type Phase = 'vocab' | 'quiz' | 'complete';

export default function LessonScreen() {
  const { language, lesson: lessonId } = useLocalSearchParams<{ language: Language; lesson: string }>();
  const course = courses[language];
  const lesson = course?.lessons.find((l) => l.id === lessonId);

  const [phase, setPhase] = useState<Phase>('vocab');
  const [wordIndex, setWordIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!course || !lesson) router.replace('/dashboard');
  }, [course, lesson]);

  if (!course || !lesson) return <View style={s.center}><ActivityIndicator size="large" color="#10b981" /></View>;

  const word = lesson.words[wordIndex];
  const question: QuizQuestion = lesson.quiz[quizIndex];

  function handleAnswer(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === question.correctIndex) setScore((sc) => sc + 1);
  }

  async function nextQuestion() {
    setSelected(null);
    if (quizIndex + 1 < lesson!.quiz.length) {
      setQuizIndex((q) => q + 1);
    } else {
      await saveAndComplete();
    }
  }

  async function saveAndComplete() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        language,
        lesson_id: lessonId,
        completed: true,
        score,
      }, { onConflict: 'user_id,language,lesson_id' });

      const { data: prof } = await supabase
        .from('profiles')
        .select('current_streak, longest_streak, last_active_date')
        .eq('id', user.id)
        .single();

      if (prof && shouldIncrementStreak(prof.last_active_date)) {
        const newStreak = prof.current_streak + 1;
        await supabase.from('profiles').update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, prof.longest_streak),
          last_active_date: new Date().toISOString(),
        }).eq('id', user.id);
      }
    }
    setSaving(false);
    setPhase('complete');
  }

  // ── Complete ──────────────────────────────────────────────
  if (phase === 'complete') {
    return (
      <View style={s.center}>
        <Text style={s.completeEmoji}>🎉</Text>
        <Text style={s.completeTitle}>Lesson Complete!</Text>
        <Text style={s.completeScore}>You scored {score}/{lesson.quiz.length}</Text>
        <TouchableOpacity style={s.btnPrimary} onPress={() => router.push(`/learn/${language}`)}>
          <Text style={s.btnPrimaryText}>Next Lesson →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btnSecondary} onPress={() => router.replace('/dashboard')}>
          <Text style={s.btnSecondaryText}>Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Vocab ─────────────────────────────────────────────────
  if (phase === 'vocab') {
    return (
      <ScrollView style={s.scroll} contentContainerStyle={s.container}>
        {/* Progress dots */}
        <View style={s.progressRow}>
          {lesson.words.map((_, i) => (
            <View key={i} style={[s.dot, i <= wordIndex && s.dotActive]} />
          ))}
        </View>
        <Text style={s.counter}>Word {wordIndex + 1} of {lesson.words.length}</Text>

        <View style={s.wordCard}>
          <Text style={s.wordText}>{word.word}</Text>
          <Text style={s.pronunciation}>{word.pronunciation}</Text>
          <Text style={s.translation}>{word.translation}</Text>
          {word.example && (
            <View style={s.exampleBox}>
              <Text style={s.exampleText}>"{word.example}"</Text>
              <Text style={s.exampleTranslation}>{word.exampleTranslation}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={s.btnPrimary}
          onPress={() => {
            if (wordIndex + 1 < lesson.words.length) setWordIndex((i) => i + 1);
            else setPhase('quiz');
          }}
        >
          <Text style={s.btnPrimaryText}>
            {wordIndex + 1 < lesson.words.length ? 'Next word →' : 'Start quiz →'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ── Quiz ──────────────────────────────────────────────────
  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <View style={s.progressRow}>
        {lesson.quiz.map((_, i) => (
          <View key={i} style={[s.dot, i < quizIndex && s.dotActive, i === quizIndex && s.dotCurrent]} />
        ))}
      </View>
      <Text style={s.counter}>Question {quizIndex + 1} of {lesson.quiz.length}</Text>

      <View style={s.questionCard}>
        <Text style={s.questionText}>{question.question}</Text>
        <View style={s.options}>
          {question.options.map((opt, i) => {
            let style = s.option;
            if (selected !== null) {
              if (i === question.correctIndex) style = s.optionCorrect;
              else if (i === selected) style = s.optionWrong;
              else style = s.optionDim;
            }
            return (
              <TouchableOpacity key={i} style={style} onPress={() => handleAnswer(i)} activeOpacity={selected !== null ? 1 : 0.75}>
                <Text style={[s.optionText, i === question.correctIndex && selected !== null && s.optionTextCorrect, i === selected && i !== question.correctIndex && s.optionTextWrong]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {selected !== null && (
        <TouchableOpacity style={s.btnPrimary} onPress={nextQuestion} disabled={saving}>
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.btnPrimaryText}>{quizIndex + 1 < lesson.quiz.length ? 'Next question →' : 'Finish lesson →'}</Text>
          }
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, backgroundColor: '#f8fafc' },
  scroll: { flex: 1, backgroundColor: '#f8fafc' },
  container: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, gap: 20 },

  progressRow: { flexDirection: 'row', gap: 6 },
  dot: { flex: 1, height: 6, borderRadius: 99, backgroundColor: '#e2e8f0' },
  dotActive: { backgroundColor: '#10b981' },
  dotCurrent: { backgroundColor: '#6ee7b7' },
  counter: { textAlign: 'center', color: '#64748b', fontSize: 13 },

  wordCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 32,
    alignItems: 'center', gap: 8,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  wordText: { fontSize: 48, fontWeight: '800', color: '#0f172a', textAlign: 'center' },
  pronunciation: { fontSize: 18, color: '#94a3b8', fontStyle: 'italic' },
  translation: { fontSize: 26, color: '#334155', fontWeight: '600' },
  exampleBox: { marginTop: 12, backgroundColor: '#f1f5f9', borderRadius: 14, padding: 16, alignItems: 'center', gap: 4 },
  exampleText: { fontSize: 14, color: '#475569', fontStyle: 'italic', textAlign: 'center' },
  exampleTranslation: { fontSize: 13, color: '#94a3b8', textAlign: 'center' },

  questionCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 24, gap: 20,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  questionText: { fontSize: 20, fontWeight: '700', color: '#0f172a', textAlign: 'center' },
  options: { gap: 10 },
  option: { borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 14, padding: 16 },
  optionCorrect: { borderWidth: 2, borderColor: '#10b981', backgroundColor: '#f0fdf4', borderRadius: 14, padding: 16 },
  optionWrong: { borderWidth: 2, borderColor: '#ef4444', backgroundColor: '#fef2f2', borderRadius: 14, padding: 16 },
  optionDim: { borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 14, padding: 16, opacity: 0.45 },
  optionText: { fontSize: 16, fontWeight: '600', color: '#334155' },
  optionTextCorrect: { color: '#059669' },
  optionTextWrong: { color: '#dc2626' },

  btnPrimary: { backgroundColor: '#10b981', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  btnSecondary: { paddingVertical: 14, borderRadius: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#cbd5e1' },
  btnSecondaryText: { color: '#475569', fontSize: 16, fontWeight: '600' },

  completeEmoji: { fontSize: 72 },
  completeTitle: { fontSize: 30, fontWeight: '800', color: '#0f172a' },
  completeScore: { fontSize: 18, color: '#64748b', marginBottom: 16 },
});
