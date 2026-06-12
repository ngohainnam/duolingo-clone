import type { Unit } from "@/types/learning";

export const units: Unit[] = [
  {
    id: "spanish-first-conversations",
    languageId: "spanish",
    order: 1,
    title: "First Conversations",
    description: "Greet people, introduce yourself, and use polite words.",
    lessonIds: ["spanish-hello", "spanish-polite-words"],
  },
  {
    id: "french-first-conversations",
    languageId: "french",
    order: 1,
    title: "First Conversations",
    description: "Say hello and introduce yourself in French.",
    lessonIds: ["french-hello"],
  },
  {
    id: "japanese-first-conversations",
    languageId: "japanese",
    order: 1,
    title: "First Conversations",
    description: "Practice polite greetings in Japanese.",
    lessonIds: ["japanese-hello"],
  },
];
