import { verifyToken } from "@clerk/backend";
import { StreamClient } from "@stream-io/node-sdk";

function getClerkVerificationOptions() {
  const jwtKey = process.env.CLERK_JWT_KEY?.replace(/\\n/g, "\n");
  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!jwtKey && !secretKey) {
    throw new Error(
      "CLERK_JWT_KEY or CLERK_SECRET_KEY is required by the Stream API routes.",
    );
  }

  return { jwtKey, secretKey };
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Missing Clerk session token.");
  }

  return authorization.slice("Bearer ".length);
}

export async function requireClerkUserId(request: Request) {
  const token = getBearerToken(request);
  const verifiedToken = await verifyToken(token, getClerkVerificationOptions());

  if (!verifiedToken.sub) {
    throw new Error("Clerk session has no user.");
  }

  return verifiedToken.sub;
}

export function getStreamServerClient() {
  const apiKey = process.env.STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("STREAM_API_KEY and STREAM_API_SECRET are required.");
  }

  return new StreamClient(apiKey, apiSecret);
}
