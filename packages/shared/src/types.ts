export type Language = "spanish" | "mandarin" | "french";

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
  createdAt: string;
}

export interface UserProgress {
  userId: string;
  language: Language;
  lessonId: string;
  completed: boolean;
  score: number;
  completedAt: string;
}
