import { getStreamServerClient } from "@/lib/stream-server";

export type VisionAgentSession = {
  callId: string;
  sessionId: string;
};

function getVisionAgentUrl() {
  return (process.env.VISION_AGENT_URL ?? "http://127.0.0.1:8000").replace(
    /\/$/,
    "",
  );
}

async function readVisionAgentError(response: Response) {
  try {
    const body = (await response.json()) as { detail?: string };
    return body.detail ?? "Vision Agent request failed.";
  } catch {
    return "Vision Agent request failed.";
  }
}

export async function assertLessonCallOwner(
  callId: string,
  callType: string,
  userId: string,
) {
  const call = getStreamServerClient().video.call(callType, callId);
  const response = await call.get();

  if (response.call.custom.learnerUserId !== userId) {
    throw new Error("You do not have access to this audio lesson call.");
  }
}

export async function startVisionAgentSession(
  callId: string,
  callType: string,
): Promise<VisionAgentSession> {
  const response = await fetch(
    `${getVisionAgentUrl()}/calls/${encodeURIComponent(callId)}/sessions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ call_type: callType }),
    },
  );

  if (!response.ok) {
    throw new Error(await readVisionAgentError(response));
  }

  const body = (await response.json()) as {
    call_id: string;
    session_id: string;
  };

  return { callId: body.call_id, sessionId: body.session_id };
}

export async function stopVisionAgentSession(
  callId: string,
  sessionId: string,
) {
  const response = await fetch(
    `${getVisionAgentUrl()}/calls/${encodeURIComponent(
      callId,
    )}/sessions/${encodeURIComponent(sessionId)}`,
    { method: "DELETE" },
  );

  if (!response.ok && response.status !== 404) {
    throw new Error(await readVisionAgentError(response));
  }
}
