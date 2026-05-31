export type Language = "spanish" | "mandarin" | "french" | "japanese" | "korean";

export type QuizType = "standard" | "listening";

export interface Word {
  word: string;
  translation: string;
  pronunciation: string;
  example?: string;
  exampleTranslation?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  type?: QuizType;
  listenWord?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  words: Word[];
  quiz: QuizQuestion[];
}

export interface LanguageCourse {
  language: Language;
  flag: string;
  displayName: string;
  lessons: Lesson[];
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  xpTotal: number;
  createdAt: string;
}

export interface UserProgress {
  userId: string;
  language: Language;
  lessonId: string;
  completed: boolean;
  score: number;
  xpEarned: number;
  completedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}
