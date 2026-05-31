import type { Badge } from "./types";

export const XP_PER_LESSON = 50;
export const XP_PERFECT_BONUS = 25;
export const DAILY_XP_GOAL = 50;

export function calcXp(score: number, total: number): number {
  const base = XP_PER_LESSON;
  const bonus = score === total ? XP_PERFECT_BONUS : 0;
  return base + bonus;
}

export function getLevel(xp: number): number {
  return Math.floor(xp / 200) + 1;
}

export function getLevelTitle(level: number): string {
  if (level <= 2) return "Beginner";
  if (level <= 4) return "Elementary";
  if (level <= 6) return "Intermediate";
  if (level <= 9) return "Advanced";
  return "Master";
}

export function getXpForNextLevel(xp: number): { current: number; needed: number; levelXp: number } {
  const level = getLevel(xp);
  const levelStart = (level - 1) * 200;
  const levelEnd = level * 200;
  return { current: xp - levelStart, needed: levelEnd - levelStart, levelXp: xp };
}

export const BADGES: Badge[] = [
  { id: "first-lesson", name: "First Steps", description: "Complete your first lesson", icon: "🎯" },
  { id: "perfect-score", name: "Perfect Score", description: "Score 100% on any quiz", icon: "⭐" },
  { id: "week-streak", name: "On a Roll", description: "Reach a 7-day streak", icon: "🔥" },
  { id: "trilingual", name: "Trilingual", description: "Complete a lesson in 3 languages", icon: "🌍" },
  { id: "all-lessons", name: "Completionist", description: "Finish all lessons in any language", icon: "🏆" },
  { id: "level-5", name: "Level Up", description: "Reach Level 5", icon: "⬆️" },
];

export function checkNewBadges(params: {
  totalCompleted: number;
  perfectScoreThisLesson: boolean;
  streak: number;
  languagesWithLessons: number;
  completedAllInLanguage: boolean;
  xpTotal: number;
  existingBadgeIds: string[];
}): string[] {
  const { totalCompleted, perfectScoreThisLesson, streak, languagesWithLessons,
    completedAllInLanguage, xpTotal, existingBadgeIds } = params;
  const has = (id: string) => existingBadgeIds.includes(id);
  const earned: string[] = [];
  if (totalCompleted >= 1 && !has("first-lesson")) earned.push("first-lesson");
  if (perfectScoreThisLesson && !has("perfect-score")) earned.push("perfect-score");
  if (streak >= 7 && !has("week-streak")) earned.push("week-streak");
  if (languagesWithLessons >= 3 && !has("trilingual")) earned.push("trilingual");
  if (completedAllInLanguage && !has("all-lessons")) earned.push("all-lessons");
  if (getLevel(xpTotal) >= 5 && !has("level-5")) earned.push("level-5");
  return earned;
}
