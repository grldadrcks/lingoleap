import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.replace('/dashboard');
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>LingoLeap</Text>
        <Text style={styles.title}>Welcome back</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
            />
          </View>
          {!!error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Log in</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/auth/signup')}>
          <Text style={styles.link}>No account? <Text style={styles.linkBold}>Sign up free</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f8fafc', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, gap: 8 },
  logo: { fontSize: 28, fontWeight: '800', color: '#10b981', textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: '#0f172a', textAlign: 'center', marginBottom: 32 },
  form: { backgroundColor: '#fff', borderRadius: 20, padding: 24, gap: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569' },
  input: { borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#0f172a', backgroundColor: '#f8fafc' },
  error: { color: '#ef4444', fontSize: 14 },
  btn: { backgroundColor: '#10b981', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { textAlign: 'center', color: '#64748b', fontSize: 15, marginTop: 20 },
  linkBold: { color: '#10b981', fontWeight: '700' },
});
