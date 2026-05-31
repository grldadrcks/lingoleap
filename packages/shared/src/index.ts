export * from "./types";
export * from "./streak";
export { spanishCourse } from "./lessons/spanish";
export { mandarinCourse } from "./lessons/mandarin";
export { frenchCourse } from "./lessons/french";
export { japaneseCourse } from "./lessons/japanese";

import { spanishCourse } from "./lessons/spanish";
import { mandarinCourse } from "./lessons/mandarin";
import { frenchCourse } from "./lessons/french";
import { japaneseCourse } from "./lessons/japanese";
import type { Language, LanguageCourse } from "./types";

export const courses: Record<Language, LanguageCourse> = {
  spanish: spanishCourse,
  mandarin: mandarinCourse,
  french: frenchCourse,
  japanese: japaneseCourse,
};
