import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const signInWithGoogle = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: "duolingoclone",
          path: "oauth-callback",
        }),
      });

      if (!createdSessionId || !setActive) {
        Alert.alert(
          "Could not continue",
          "Google authentication needs additional information.",
        );
        return;
      }

      await setActive({
        session: createdSessionId,
        navigate: () => router.replace("/"),
      });
    } catch (error) {
      console.error("Google authentication failed", error);
      Alert.alert(
        "Could not continue",
        "Google authentication could not be completed. Please try again.",
      );
    }
  };

  return { signInWithGoogle };
}
