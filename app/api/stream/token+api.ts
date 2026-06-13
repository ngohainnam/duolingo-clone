import {
  getStreamServerClient,
  requireClerkUserId,
} from "@/lib/stream-server";

const TOKEN_VALIDITY_SECONDS = 60 * 60 * 4;
const TOKEN_CLOCK_SKEW_SECONDS = 60;

export async function GET(request: Request) {
  try {
    const userId = await requireClerkUserId(request);
    const stream = getStreamServerClient();
    const token = stream.generateUserToken({
      user_id: userId,
      validity_in_seconds: TOKEN_VALIDITY_SECONDS,
      // Prevent small clock differences from making a fresh token look future-dated.
      iat: Math.floor(Date.now() / 1000) - TOKEN_CLOCK_SKEW_SECONDS,
    });

    return Response.json(
      { apiKey: stream.apiKey, token },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Stream token error", error);
    return Response.json(
      { error: "Unable to authenticate the Stream session." },
      { status: 401 },
    );
  }
}
