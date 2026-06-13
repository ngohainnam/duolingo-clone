import { requireClerkUserId } from "@/lib/stream-server";
import {
  assertLessonCallOwner,
  stopVisionAgentSession,
} from "@/lib/vision-agent-server";

type StopAgentBody = {
  callId?: string;
  callType?: string;
  sessionId?: string;
};

export async function POST(request: Request) {
  try {
    const userId = await requireClerkUserId(request);
    const body = (await request.json()) as StopAgentBody;

    if (!body.callId || body.callType !== "audio_room" || !body.sessionId) {
      return Response.json(
        { error: "A valid AI teacher session is required." },
        { status: 400 },
      );
    }

    await assertLessonCallOwner(body.callId, body.callType, userId);
    await stopVisionAgentSession(body.callId, body.sessionId);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Vision Agent stop error", error);
    return Response.json(
      { error: "Unable to stop the AI teacher session." },
      { status: 500 },
    );
  }
}
