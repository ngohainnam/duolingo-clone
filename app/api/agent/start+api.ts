import { requireClerkUserId } from "@/lib/stream-server";
import {
  assertLessonCallOwner,
  startVisionAgentSession,
} from "@/lib/vision-agent-server";

type StartAgentBody = {
  callId?: string;
  callType?: string;
};

export async function POST(request: Request) {
  try {
    const userId = await requireClerkUserId(request);
    const body = (await request.json()) as StartAgentBody;

    if (!body.callId || body.callType !== "audio_room") {
      return Response.json(
        { error: "A valid audio lesson call is required." },
        { status: 400 },
      );
    }

    await assertLessonCallOwner(body.callId, body.callType, userId);
    const session = await startVisionAgentSession(body.callId, body.callType);

    return Response.json(session, { status: 201 });
  } catch (error) {
    console.error("Vision Agent start error", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to connect the AI teacher.",
      },
      { status: 500 },
    );
  }
}
