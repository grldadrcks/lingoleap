import LessonClient from "./LessonClient";
import { courses } from "@lingo/shared";

export function generateStaticParams() {
  return Object.entries(courses).flatMap(([language, course]) =>
    course.lessons.map((lesson) => ({ language, lesson: lesson.id }))
  );
}

export default function LessonPage() {
  return <LessonClient />;
}
