import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

const LANGUAGES = [
  { flag: '🇪🇸', name: 'Spanish' },
  { flag: '🇨🇳', name: 'Mandarin' },
  { flag: '🇫🇷', name: 'French' },
];

export default function WelcomeScreen() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard');
      else setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>LingoLeap</Text>
        <Text style={styles.tagline}>Learn a language for free,{'\n'}one day at a time</Text>
        <View style={styles.flagRow}>
          {LANGUAGES.map((l) => (
            <Text key={l.name} style={styles.flag}>{l.flag}</Text>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => router.push('/auth/signup')}>
          <Text style={styles.btnPrimaryText}>Get started free</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={() => router.push('/auth/login')}>
          <Text style={styles.btnSecondaryText}>I already have an account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        {[
          { icon: '🔥', label: 'Daily streaks' },
          { icon: '🧠', label: 'Smart quizzes' },
          { icon: '📈', label: 'Track progress' },
        ].map((f) => (
          <View key={f.label} style={styles.feature}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureLabel}>{f.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  logo: { fontSize: 36, fontWeight: '800', color: '#10b981' },
  tagline: { fontSize: 22, fontWeight: '600', color: '#0f172a', textAlign: 'center', lineHeight: 32 },
  flagRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
  flag: { fontSize: 40 },
  actions: { gap: 12, marginBottom: 32 },
  btnPrimary: { backgroundColor: '#10b981', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  btnSecondary: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#cbd5e1' },
  btnSecondaryText: { color: '#475569', fontSize: 16, fontWeight: '600' },
  features: { flexDirection: 'row', justifyContent: 'space-around' },
  feature: { alignItems: 'center', gap: 4 },
  featureIcon: { fontSize: 28 },
  featureLabel: { fontSize: 12, color: '#64748b', fontWeight: '500' },
});
