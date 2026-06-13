type GetClerkToken = () => Promise<string | null>;

type StreamTokenResponse = {
  apiKey: string;
  token: string;
};

export type StreamCallSession = {
  callId: string;
  callType: "audio_room";
};

export type VisionAgentSession = {
  callId: string;
  sessionId: string;
};

async function streamRequest<T>(
  path: string,
  getToken: GetClerkToken,
  init?: RequestInit,
) {
  const clerkToken = await getToken();

  if (!clerkToken) {
    throw new Error("Sign in to start an audio lesson.");
  }

  const response = await fetch(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${clerkToken}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (response.status === 204) {
    return {} as T;
  }

  const body = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(body.error ?? "Stream request failed.");
  }

  return body;
}

export function getStreamToken(getToken: GetClerkToken) {
  return streamRequest<StreamTokenResponse>("/api/stream/token", getToken);
}

export function createStreamLessonCall(
  getToken: GetClerkToken,
  lessonId: string,
  languageId: string,
) {
  return streamRequest<StreamCallSession>("/api/stream/calls", getToken, {
    method: "POST",
    body: JSON.stringify({ lessonId, languageId }),
  });
}

export function startVisionAgent(
  getToken: GetClerkToken,
  call: StreamCallSession,
) {
  return streamRequest<VisionAgentSession>("/api/agent/start", getToken, {
    method: "POST",
    body: JSON.stringify(call),
  });
}

export function stopVisionAgent(
  getToken: GetClerkToken,
  call: StreamCallSession,
  sessionId: string,
) {
  return streamRequest<Record<string, never>>("/api/agent/stop", getToken, {
    method: "POST",
    body: JSON.stringify({ ...call, sessionId }),
  });
}
