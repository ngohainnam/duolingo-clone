import type { Lesson } from "@/types/learning";

const coreLessons: Lesson[] = [
  {
    id: "spanish-hello",
    unitId: "spanish-first-conversations",
    languageId: "spanish",
    order: 1,
    title: "Say Hello",
    description: "Meet someone and share your name.",
    difficulty: "beginner",
    estimatedMinutes: 5,
    xpReward: 10,
    goals: [
      { id: "greet-someone", description: "Greet someone in Spanish." },
      { id: "share-name", description: "Say your name in Spanish." },
    ],
    vocabulary: [
      {
        id: "hola",
        term: "hola",
        translation: "hello",
        pronunciation: "OH-lah",
      },
      {
        id: "me-llamo",
        term: "me llamo",
        translation: "my name is",
        pronunciation: "meh YAH-moh",
      },
    ],
    phrases: [
      {
        id: "hola-me-llamo",
        text: "Hola, me llamo Ana.",
        translation: "Hello, my name is Ana.",
        pronunciation: "OH-lah, meh YAH-moh AH-nah",
      },
    ],
    activities: [
      {
        id: "learn-greeting-words",
        type: "learn-vocabulary",
        instruction: "Learn these greeting words.",
        vocabularyIds: ["hola", "me-llamo"],
      },
      {
        id: "choose-hola",
        type: "multiple-choice",
        instruction: "Choose the correct answer.",
        prompt: "What does “hola” mean?",
        options: [
          { id: "hello", text: "Hello" },
          { id: "goodbye", text: "Goodbye" },
          { id: "please", text: "Please" },
        ],
        correctOptionId: "hello",
      },
      {
        id: "say-introduction",
        type: "speaking",
        instruction: "Introduce yourself aloud.",
        phraseId: "hola-me-llamo",
        coachingTip: "Pause briefly after hola, then say your name clearly.",
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are a warm Spanish teacher helping a complete beginner practice greetings. Speak slowly, use short sentences, and explain corrections in English.",
      openingMessage:
        "¡Hola! Let’s practice saying hello and introducing ourselves.",
      coachingNotes: [
        "Model each Spanish phrase before asking the learner to repeat it.",
        "Praise effort before giving one short pronunciation correction.",
        "Ask the learner to replace Ana with their own name.",
      ],
      successMessage: "Great job! You can now greet someone in Spanish.",
    },
  },
  {
    id: "spanish-polite-words",
    unitId: "spanish-first-conversations",
    languageId: "spanish",
    order: 2,
    title: "Be Polite",
    description: "Use please and thank you in Spanish.",
    difficulty: "beginner",
    estimatedMinutes: 4,
    xpReward: 10,
    goals: [
      { id: "say-please", description: "Say please in Spanish." },
      { id: "say-thank-you", description: "Thank someone in Spanish." },
    ],
    vocabulary: [
      {
        id: "por-favor",
        term: "por favor",
        translation: "please",
        pronunciation: "por fah-VOR",
      },
      {
        id: "gracias",
        term: "gracias",
        translation: "thank you",
        pronunciation: "GRAH-syahs",
      },
    ],
    phrases: [
      {
        id: "agua-por-favor",
        text: "Agua, por favor.",
        translation: "Water, please.",
        pronunciation: "AH-gwah, por fah-VOR",
      },
      {
        id: "muchas-gracias",
        text: "Muchas gracias.",
        translation: "Thank you very much.",
        pronunciation: "MOO-chahs GRAH-syahs",
      },
    ],
    activities: [
      {
        id: "learn-polite-words",
        type: "learn-vocabulary",
        instruction: "Learn these polite words.",
        vocabularyIds: ["por-favor", "gracias"],
      },
      {
        id: "translate-thank-you",
        type: "translate",
        instruction: "Translate into Spanish.",
        prompt: "Thank you",
        direction: "to-learning-language",
        acceptedAnswers: ["gracias"],
      },
      {
        id: "repeat-water-please",
        type: "listen-and-repeat",
        instruction: "Listen, then repeat the phrase.",
        phraseId: "agua-por-favor",
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are a patient Spanish teacher helping a beginner use polite words. Keep the practice conversational and explain corrections in English.",
      openingMessage: "Let’s practice two words that make every conversation kinder.",
      coachingNotes: [
        "Say por favor and gracias slowly before normal-speed examples.",
        "Invite the learner to order water politely.",
        "Keep corrections brief and encouraging.",
      ],
      successMessage: "Wonderful! You can now ask politely and say thank you.",
    },
  },
  {
    id: "french-hello",
    unitId: "french-first-conversations",
    languageId: "french",
    order: 1,
    title: "Say Hello",
    description: "Greet someone and share your name.",
    difficulty: "beginner",
    estimatedMinutes: 5,
    xpReward: 10,
    goals: [
      { id: "greet-someone", description: "Greet someone in French." },
      { id: "share-name", description: "Say your name in French." },
    ],
    vocabulary: [
      {
        id: "bonjour",
        term: "bonjour",
        translation: "hello",
        pronunciation: "bohn-ZHOOR",
      },
      {
        id: "je-m-appelle",
        term: "je m’appelle",
        translation: "my name is",
        pronunciation: "zhuh mah-PELL",
      },
    ],
    phrases: [
      {
        id: "bonjour-je-m-appelle",
        text: "Bonjour, je m’appelle Léa.",
        translation: "Hello, my name is Léa.",
        pronunciation: "bohn-ZHOOR, zhuh mah-PELL lay-AH",
      },
    ],
    activities: [
      {
        id: "learn-greeting-words",
        type: "learn-vocabulary",
        instruction: "Learn these greeting words.",
        vocabularyIds: ["bonjour", "je-m-appelle"],
      },
      {
        id: "choose-bonjour",
        type: "multiple-choice",
        instruction: "Choose the correct answer.",
        prompt: "What does “bonjour” mean?",
        options: [
          { id: "hello", text: "Hello" },
          { id: "thanks", text: "Thanks" },
          { id: "water", text: "Water" },
        ],
        correctOptionId: "hello",
      },
      {
        id: "say-introduction",
        type: "speaking",
        instruction: "Introduce yourself aloud.",
        phraseId: "bonjour-je-m-appelle",
        coachingTip: "Keep bonjour smooth and use your own name at the end.",
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are a friendly French teacher helping a complete beginner practice greetings. Speak clearly, use short examples, and explain corrections in English.",
      openingMessage:
        "Bonjour! Let’s learn how to greet someone and say your name.",
      coachingNotes: [
        "Model the phrases slowly before asking the learner to repeat.",
        "Help the learner soften the French j sound.",
        "Ask the learner to introduce themselves using their own name.",
      ],
      successMessage: "Très bien! You can now introduce yourself in French.",
    },
  },
  {
    id: "japanese-hello",
    unitId: "japanese-first-conversations",
    languageId: "japanese",
    order: 1,
    title: "Say Hello",
    description: "Use polite greetings in Japanese.",
    difficulty: "beginner",
    estimatedMinutes: 5,
    xpReward: 10,
    goals: [
      { id: "say-hello", description: "Say hello in Japanese." },
      { id: "say-thank-you", description: "Thank someone politely." },
    ],
    vocabulary: [
      {
        id: "konnichiwa",
        term: "こんにちは",
        translation: "hello",
        pronunciation: "kohn-nee-chee-wah",
      },
      {
        id: "arigatou",
        term: "ありがとう",
        translation: "thank you",
        pronunciation: "ah-ree-gah-toh",
      },
    ],
    phrases: [
      {
        id: "konnichiwa-phrase",
        text: "こんにちは。",
        translation: "Hello.",
        pronunciation: "kohn-nee-chee-wah",
      },
      {
        id: "arigatou-gozaimasu",
        text: "ありがとうございます。",
        translation: "Thank you very much.",
        pronunciation: "ah-ree-gah-toh goh-zah-ee-mahs",
      },
    ],
    activities: [
      {
        id: "learn-polite-greetings",
        type: "learn-vocabulary",
        instruction: "Learn these polite expressions.",
        vocabularyIds: ["konnichiwa", "arigatou"],
      },
      {
        id: "choose-konnichiwa",
        type: "multiple-choice",
        instruction: "Choose the correct answer.",
        prompt: "What does “こんにちは” mean?",
        options: [
          { id: "hello", text: "Hello" },
          { id: "goodbye", text: "Goodbye" },
          { id: "yes", text: "Yes" },
        ],
        correctOptionId: "hello",
      },
      {
        id: "repeat-thank-you",
        type: "listen-and-repeat",
        instruction: "Listen, then repeat the polite phrase.",
        phraseId: "arigatou-gozaimasu",
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are a kind Japanese teacher helping a complete beginner practice polite greetings. Speak slowly, use romaji support, and explain corrections in English.",
      openingMessage:
        "こんにちは! Let’s practice two polite Japanese greetings.",
      coachingNotes: [
        "Break longer phrases into short chunks before combining them.",
        "Use romaji only as pronunciation support.",
        "Explain that ありがとうございます is more polite than ありがとう.",
      ],
      successMessage: "よくできました! You can now greet and thank someone politely.",
    },
  },
];

type LessonSeed = {
  id: string;
  unitId: string;
  languageId: Lesson["languageId"];
  order: number;
  title: string;
  description: string;
  term: string;
  translation: string;
};

function createLesson(seed: LessonSeed): Lesson {
  const {
    term,
    translation,
    ...lessonDetails
  } = seed;
  const vocabularyId = `${seed.id}-word`;
  const phraseId = `${seed.id}-phrase`;

  return {
    ...lessonDetails,
    difficulty: "beginner",
    estimatedMinutes: 6,
    xpReward: 10,
    goals: [
      {
        id: `${seed.id}-goal`,
        description: `Use a helpful phrase about ${seed.title.toLowerCase()}.`,
      },
    ],
    vocabulary: [
      {
        id: vocabularyId,
        term,
        translation,
      },
    ],
    phrases: [
      {
        id: phraseId,
        text: term,
        translation,
      },
    ],
    activities: [
      {
        id: `${seed.id}-learn`,
        type: "learn-vocabulary",
        instruction: "Learn this useful expression.",
        vocabularyIds: [vocabularyId],
      },
      {
        id: `${seed.id}-repeat`,
        type: "listen-and-repeat",
        instruction: "Listen, then repeat the phrase.",
        phraseId,
      },
    ],
    aiTeacherPrompt: {
      systemPrompt: `You are a friendly ${seed.languageId} teacher helping a beginner practice ${seed.title.toLowerCase()}.`,
      openingMessage: `Let's practice ${seed.title.toLowerCase()}.`,
      coachingNotes: [
        "Model the phrase slowly before asking the learner to repeat it.",
        "Keep corrections short, clear, and encouraging.",
      ],
      successMessage: `Great work! You practiced ${seed.title.toLowerCase()}.`,
    },
  };
}

const additionalLessons: Lesson[] = [
  createLesson({
    id: "spanish-cafe",
    unitId: "spanish-first-conversations",
    languageId: "spanish",
    order: 3,
    title: "At the Cafe",
    description: "Order a drink and chat at a cafe.",
    term: "Un cafe, por favor.",
    translation: "A coffee, please.",
  }),
  createLesson({
    id: "spanish-travel",
    unitId: "spanish-first-conversations",
    languageId: "spanish",
    order: 4,
    title: "Travel & Directions",
    description: "Ask where to go and understand directions.",
    term: "Donde esta la estacion?",
    translation: "Where is the station?",
  }),
  createLesson({
    id: "spanish-shopping",
    unitId: "spanish-first-conversations",
    languageId: "spanish",
    order: 5,
    title: "Shopping",
    description: "Ask prices and buy everyday items.",
    term: "Cuanto cuesta?",
    translation: "How much does it cost?",
  }),
  createLesson({
    id: "spanish-family",
    unitId: "spanish-first-conversations",
    languageId: "spanish",
    order: 6,
    title: "Family & Friends",
    description: "Talk about the important people in your life.",
    term: "Esta es mi familia.",
    translation: "This is my family.",
  }),
  createLesson({
    id: "french-polite-words",
    unitId: "french-first-conversations",
    languageId: "french",
    order: 2,
    title: "Be Polite",
    description: "Use please and thank you in French.",
    term: "Merci beaucoup.",
    translation: "Thank you very much.",
  }),
  createLesson({
    id: "french-cafe",
    unitId: "french-first-conversations",
    languageId: "french",
    order: 3,
    title: "At the Cafe",
    description: "Order a drink and snack in French.",
    term: "Un cafe, s'il vous plait.",
    translation: "A coffee, please.",
  }),
  createLesson({
    id: "french-travel",
    unitId: "french-first-conversations",
    languageId: "french",
    order: 4,
    title: "Travel & Directions",
    description: "Find your way around a new city.",
    term: "Ou est la gare?",
    translation: "Where is the station?",
  }),
  createLesson({
    id: "french-shopping",
    unitId: "french-first-conversations",
    languageId: "french",
    order: 5,
    title: "Shopping",
    description: "Ask prices and shop with confidence.",
    term: "C'est combien?",
    translation: "How much is it?",
  }),
  createLesson({
    id: "french-family",
    unitId: "french-first-conversations",
    languageId: "french",
    order: 6,
    title: "Family & Friends",
    description: "Introduce your family and friends.",
    term: "Voici ma famille.",
    translation: "Here is my family.",
  }),
  createLesson({
    id: "japanese-polite-words",
    unitId: "japanese-first-conversations",
    languageId: "japanese",
    order: 2,
    title: "Be Polite",
    description: "Use polite everyday expressions.",
    term: "Sumimasen.",
    translation: "Excuse me.",
  }),
  createLesson({
    id: "japanese-cafe",
    unitId: "japanese-first-conversations",
    languageId: "japanese",
    order: 3,
    title: "At the Cafe",
    description: "Order a drink at a Japanese cafe.",
    term: "Koohii o kudasai.",
    translation: "Coffee, please.",
  }),
  createLesson({
    id: "japanese-travel",
    unitId: "japanese-first-conversations",
    languageId: "japanese",
    order: 4,
    title: "Travel & Directions",
    description: "Ask for directions while traveling.",
    term: "Eki wa doko desu ka?",
    translation: "Where is the station?",
  }),
  createLesson({
    id: "japanese-shopping",
    unitId: "japanese-first-conversations",
    languageId: "japanese",
    order: 5,
    title: "Shopping",
    description: "Ask prices and shop for souvenirs.",
    term: "Ikura desu ka?",
    translation: "How much is it?",
  }),
  createLesson({
    id: "japanese-family",
    unitId: "japanese-first-conversations",
    languageId: "japanese",
    order: 6,
    title: "Family & Friends",
    description: "Talk simply about family and friends.",
    term: "Watashi no kazoku desu.",
    translation: "This is my family.",
  }),
];

export const lessons: Lesson[] = [...coreLessons, ...additionalLessons];
