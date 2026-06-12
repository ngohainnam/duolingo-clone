import type { Language } from "@/types/learning";

export const languages: Language[] = [
  {
    id: "spanish",
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "https://flagcdn.com/w320/es.png",
    color: "#F1BF00",
    description: "Learn useful Spanish for friendly everyday conversations.",
  },
  {
    id: "french",
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "https://flagcdn.com/w320/fr.png",
    color: "#0055A4",
    description: "Build confidence with simple French words and phrases.",
  },
  {
    id: "japanese",
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "https://flagcdn.com/w320/jp.png",
    color: "#BC002D",
    description: "Start speaking Japanese with polite everyday expressions.",
  },
];
