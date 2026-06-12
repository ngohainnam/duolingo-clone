import earth from "@/assets/images/earth.png";
import mascotAuth from "@/assets/images/mascot-auth.png";
import mascotLogo from "@/assets/images/moscot-logo.png";
import mascotWelcome from "@/assets/images/mascot-welcome.png";
import palace from "@/assets/images/palace.png";
import streakFire from "@/assets/images/streak-fire.png";
import treasure from "@/assets/images/treasure.png";

export const images = {
  aiTeacher:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  earth,
  mascotAuth,
  mascotLogo,
  mascotWelcome,
  palace,
  streakFire,
  treasure,
} as const;

export const lessonImages: Record<string, string> = {
  "spanish-hello": "https://picsum.photos/seed/spanish-hello/900/520",
  "spanish-polite-words": "https://picsum.photos/seed/spanish-polite/900/520",
  "spanish-cafe": "https://picsum.photos/seed/spanish-cafe/900/520",
  "spanish-travel": "https://picsum.photos/seed/spanish-travel/900/520",
  "spanish-shopping": "https://picsum.photos/seed/spanish-shopping/900/520",
  "spanish-family": "https://picsum.photos/seed/spanish-family/900/520",
  "french-hello": "https://picsum.photos/seed/french-hello/900/520",
  "french-polite-words": "https://picsum.photos/seed/french-polite/900/520",
  "french-cafe": "https://picsum.photos/seed/french-cafe/900/520",
  "french-travel": "https://picsum.photos/seed/french-travel/900/520",
  "french-shopping": "https://picsum.photos/seed/french-shopping/900/520",
  "french-family": "https://picsum.photos/seed/french-family/900/520",
  "japanese-hello": "https://picsum.photos/seed/japanese-hello/900/520",
  "japanese-polite-words": "https://picsum.photos/seed/japanese-polite/900/520",
  "japanese-cafe": "https://picsum.photos/seed/japanese-cafe/900/520",
  "japanese-travel": "https://picsum.photos/seed/japanese-travel/900/520",
  "japanese-shopping": "https://picsum.photos/seed/japanese-shopping/900/520",
  "japanese-family": "https://picsum.photos/seed/japanese-family/900/520",
};

export const fallbackLessonImage =
  "https://picsum.photos/seed/language-lesson/900/520";
