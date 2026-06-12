export type LanguageId = "spanish" | "french" | "japanese";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Language = {
  id: LanguageId;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  color: string;
  description: string;
};

export type Unit = {
  id: string;
  languageId: LanguageId;
  order: number;
  title: string;
  description: string;
  lessonIds: string[];
};

export type LessonGoal = {
  id: string;
  description: string;
};

export type VocabularyItem = {
  id: string;
  term: string;
  translation: string;
  pronunciation?: string;
  partOfSpeech?: string;
};

export type Phrase = {
  id: string;
  text: string;
  translation: string;
  pronunciation?: string;
};

type ActivityBase = {
  id: string;
  instruction: string;
};

export type LearnVocabularyActivity = ActivityBase & {
  type: "learn-vocabulary";
  vocabularyIds: string[];
};

export type MultipleChoiceActivity = ActivityBase & {
  type: "multiple-choice";
  prompt: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
};

export type TranslateActivity = ActivityBase & {
  type: "translate";
  prompt: string;
  direction: "to-learning-language" | "to-native-language";
  acceptedAnswers: string[];
};

export type SpeakingActivity = ActivityBase & {
  type: "speaking";
  phraseId: string;
  coachingTip: string;
};

export type ListenAndRepeatActivity = ActivityBase & {
  type: "listen-and-repeat";
  phraseId: string;
};

export type LessonActivity =
  | LearnVocabularyActivity
  | MultipleChoiceActivity
  | TranslateActivity
  | SpeakingActivity
  | ListenAndRepeatActivity;

export type AITeacherPrompt = {
  systemPrompt: string;
  openingMessage: string;
  coachingNotes: string[];
  successMessage: string;
};

export type Lesson = {
  id: string;
  unitId: string;
  languageId: LanguageId;
  order: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  xpReward: number;
  goals: LessonGoal[];
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  activities: LessonActivity[];
  aiTeacherPrompt: AITeacherPrompt;
};
