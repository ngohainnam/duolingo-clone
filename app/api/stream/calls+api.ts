import { lessons } from "@/data/lessons";
import { languages } from "@/data/languages";
import {
  getStreamServerClient,
  requireClerkUserId,
} from "@/lib/stream-server";

const AI_TEACHER_USER_ID = "ai-language-teacher";

type CreateCallBody = {
  languageId?: string;
  lessonId?: string;
};

export async function POST(request: Request) {
  try {
    const userId = await requireClerkUserId(request);
    const body = (await request.json()) as CreateCallBody;
    const lesson = lessons.find((item) => item.id === body.lessonId);
    const language = languages.find((item) => item.id === body.languageId);

    if (!lesson || !language || lesson.languageId !== language.id) {
      return Response.json(
        { error: "Select a valid lesson and language." },
        { status: 400 },
      );
    }

    const stream = getStreamServerClient();
    const callType = "audio_room" as const;
    const callId = `${lesson.id}-${crypto.randomUUID()}`;
    const call = stream.video.call(callType, callId);

    await call.getOrCreate({
      video: false,
      data: {
        created_by_id: userId,
        members: [
          { user_id: userId, role: "admin" },
          { user_id: AI_TEACHER_USER_ID, role: "admin" },
        ],
        custom: {
          learnerUserId: userId,
          language: {
            id: language.id,
            code: language.code,
            name: language.name,
            nativeName: language.nativeName,
          },
          lesson: {
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            difficulty: lesson.difficulty,
            estimatedMinutes: lesson.estimatedMinutes,
          },
          goals: lesson.goals,
          vocabulary: lesson.vocabulary,
          phrases: lesson.phrases,
          aiTeacherPrompt: lesson.aiTeacherPrompt,
        },
        video: false,
      },
    });
    await call.goLive();

    return Response.json({ callId, callType }, { status: 201 });
  } catch (error) {
    console.error("Stream call creation error", error);
    return Response.json(
      { error: "Unable to create the audio lesson call." },
      { status: 500 },
    );
  }
}
