import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="learn/[language]" options={{ headerShown: true, headerTitle: '', headerBackTitle: 'Back', headerTintColor: '#10b981' }} />
        <Stack.Screen name="learn/[language]/[lesson]" options={{ headerShown: true, headerTitle: '', headerBackTitle: 'Back', headerTintColor: '#10b981' }} />
      </Stack>
    </>
  );
}
