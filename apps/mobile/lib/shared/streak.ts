export function shouldIncrementStreak(lastActiveDate: string | null): boolean {
  if (!lastActiveDate) return true;
  const last = new Date(lastActiveDate);
  const today = new Date();
  return (
    last.getFullYear() !== today.getFullYear() ||
    last.getMonth() !== today.getMonth() ||
    last.getDate() !== today.getDate()
  );
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your streak today!";
  if (streak === 1) return "1 day streak — keep it up!";
  if (streak < 7) return `${streak} day streak — you're on a roll!`;
  if (streak < 30) return `${streak} day streak — amazing!`;
  return `${streak} day streak — legendary!`;
}
