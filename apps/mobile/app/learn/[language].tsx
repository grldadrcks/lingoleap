import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { courses } from '../../lib/shared';
import type { Language } from '../../lib/shared';

export default function LanguageScreen() {
  const { language } = useLocalSearchParams<{ language: Language }>();
  const course = courses[language];
  const [completed, setCompleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!course) { router.replace('/dashboard'); return; }
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/'); return; }
      const { data } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('language', language)
        .eq('completed', true);
      setCompleted((data ?? []).map((p) => p.lesson_id));
      setLoading(false);
    }
    load();
  }, [language, course]);

  if (!course || loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>;
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.flag}>{course.flag}</Text>
        <View>
          <Text style={styles.title}>{course.displayName}</Text>
          <Text style={styles.subtitle}>{course.lessons.length} lessons</Text>
        </View>
      </View>

      <View style={styles.list}>
        {course.lessons.map((lesson, i) => {
          const done = completed.includes(lesson.id);
          const locked = i > 0 && !completed.includes(course.lessons[i - 1].id);
          return (
            <TouchableOpacity
              key={lesson.id}
              style={[styles.card, done && styles.cardDone, locked && styles.cardLocked]}
              onPress={() => !locked && router.push(`/learn/${language}/${lesson.id}`)}
              activeOpacity={locked ? 1 : 0.75}
            >
              <View style={[styles.badge, done && styles.badgeDone]}>
                <Text style={[styles.badgeText, done && styles.badgeTextDone]}>{done ? '✓' : i + 1}</Text>
              </View>
              <View style={styles.info}>
                <Text style={[styles.lessonTitle, locked && styles.lockedText]}>{lesson.title}</Text>
                <Text style={[styles.lessonDesc, locked && styles.lockedText]}>{lesson.description}</Text>
              </View>
              {locked && <Text style={styles.lock}>🔒</Text>}
              {done && <Text style={styles.doneLabel}>Done</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1, backgroundColor: '#f8fafc' },
  container: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40, gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  flag: { fontSize: 56 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 2 },
  list: { gap: 12 },
  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1.5, borderColor: '#e2e8f0',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  cardDone: { backgroundColor: '#f0fdf4', borderColor: '#86efac' },
  cardLocked: { opacity: 0.5 },
  badge: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center',
  },
  badgeDone: { backgroundColor: '#10b981' },
  badgeText: { fontWeight: '700', color: '#64748b', fontSize: 16 },
  badgeTextDone: { color: '#fff' },
  info: { flex: 1 },
  lessonTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  lessonDesc: { fontSize: 13, color: '#64748b', marginTop: 2 },
  lockedText: { color: '#94a3b8' },
  lock: { fontSize: 18 },
  doneLabel: { fontSize: 13, color: '#10b981', fontWeight: '700' },
});
