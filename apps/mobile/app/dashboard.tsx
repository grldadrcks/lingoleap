import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { getStreakMessage } from '@lingo/shared';

interface Profile {
  username: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

const LANGUAGES = [
  { key: 'spanish', flag: '🇪🇸', name: 'Spanish', total: 3 },
  { key: 'mandarin', flag: '🇨🇳', name: 'Mandarin', total: 3 },
  { key: 'french', flag: '🇫🇷', name: 'French', total: 3 },
  { key: 'japanese', flag: '🇯🇵', name: 'Japanese', total: 3 },
  { key: 'korean', flag: '🇰🇷', name: 'Korean', total: 3 },
];

export default function DashboardScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<{ language: string; lesson_id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/'); return; }

      const [{ data: prof }, { data: prog }] = await Promise.all([
        supabase.from('profiles').select('username, current_streak, longest_streak, last_active_date').eq('id', user.id).single(),
        supabase.from('user_progress').select('language, lesson_id').eq('user_id', user.id).eq('completed', true),
      ]);

      setProfile(prof);
      setProgress(prog ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#10b981" /></View>;
  }

  const streak = profile?.current_streak ?? 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>LingoLeap</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.greeting}>Hi, {profile?.username} 👋</Text>

      {/* Streak Card */}
      <View style={styles.streakCard}>
        <View>
          <Text style={styles.streakLabel}>Current Streak</Text>
          <Text style={styles.streakNumber}>{streak} 🔥</Text>
          <Text style={styles.streakMsg}>{getStreakMessage(streak)}</Text>
        </View>
        <View style={styles.streakRight}>
          <Text style={styles.streakBestLabel}>Best</Text>
          <Text style={styles.streakBest}>{profile?.longest_streak ?? 0} days</Text>
        </View>
      </View>

      {/* Languages */}
      <Text style={styles.sectionTitle}>Your Languages</Text>
      <View style={styles.langGrid}>
        {LANGUAGES.map((lang) => {
          const completed = progress.filter((p) => p.language === lang.key).length;
          const pct = Math.round((completed / lang.total) * 100);
          return (
            <TouchableOpacity
              key={lang.key}
              style={styles.langCard}
              onPress={() => router.push(`/learn/${lang.key}`)}
              activeOpacity={0.75}
            >
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <Text style={styles.langName}>{lang.name}</Text>
              <Text style={styles.langProgress}>{completed}/{lang.total} lessons</Text>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${pct}%` as any }]} />
              </View>
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
  container: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  logo: { fontSize: 24, fontWeight: '800', color: '#10b981' },
  logoutText: { fontSize: 14, color: '#94a3b8' },
  greeting: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  streakCard: {
    backgroundColor: '#10b981', borderRadius: 24, padding: 24,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginVertical: 8,
  },
  streakLabel: { color: '#d1fae5', fontSize: 13, fontWeight: '600' },
  streakNumber: { color: '#fff', fontSize: 44, fontWeight: '800', marginTop: 2 },
  streakMsg: { color: '#d1fae5', fontSize: 13, marginTop: 4 },
  streakRight: { alignItems: 'flex-end' },
  streakBestLabel: { color: '#d1fae5', fontSize: 12 },
  streakBest: { color: '#fff', fontSize: 22, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginTop: 8 },
  langGrid: { gap: 12 },
  langCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, gap: 6,
  },
  langFlag: { fontSize: 36 },
  langName: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  langProgress: { fontSize: 13, color: '#64748b' },
  progressBg: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 99, overflow: 'hidden', marginTop: 2 },
  progressFill: { height: '100%', backgroundColor: '#10b981', borderRadius: 99 },
});
