import { useAuth, useUser } from "@clerk/expo";
import {
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import { getStreamToken } from "@/lib/stream-api";

type StreamConnection = {
  client?: StreamVideoClient;
  error: string | null;
  isConnecting: boolean;
  retry: () => void;
};

const StreamConnectionContext = createContext<StreamConnection>({
  error: null,
  isConnecting: false,
  retry: () => undefined,
});

export function StreamVideoProvider({ children }: PropsWithChildren) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const getTokenRef = useRef(getToken);
  const [client, setClient] = useState<StreamVideoClient>();
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const userId = user?.id;
  const userImage = user?.imageUrl;
  const userName = user?.fullName ?? user?.username ?? "Learner";

  const tokenProvider = useCallback(async () => {
    const response = await getStreamToken(getTokenRef.current);
    return response.token;
  }, []);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) {
      return;
    }

    let active = true;
    let streamClient: StreamVideoClient | undefined;

    const connect = async () => {
      setIsConnecting(true);
      setError(null);

      try {
        const { apiKey } = await getStreamToken(getTokenRef.current);
        streamClient = StreamVideoClient.getOrCreateInstance({
          apiKey,
          tokenProvider,
          user: {
            id: userId,
            image: userImage,
            name: userName,
          },
        });

        if (active) {
          setClient(streamClient);
        }
      } catch (connectionError) {
        if (active) {
          setError(
            connectionError instanceof Error
              ? connectionError.message
              : "Could not connect to Stream.",
          );
        }
      } finally {
        if (active) {
          setIsConnecting(false);
        }
      }
    };

    connect();

    return () => {
      active = false;
      setClient(undefined);
      streamClient?.disconnectUser().catch(console.error);
    };
  }, [
    isLoaded,
    isSignedIn,
    retryKey,
    tokenProvider,
    userId,
    userImage,
    userName,
  ]);

  const retry = useCallback(() => setRetryKey((value) => value + 1), []);
  const connection = useMemo(
    () => ({ client, error, isConnecting, retry }),
    [client, error, isConnecting, retry],
  );

  return (
    <StreamConnectionContext.Provider value={connection}>
      {client ? <StreamVideo client={client}>{children}</StreamVideo> : children}
    </StreamConnectionContext.Provider>
  );
}

export function useStreamConnection() {
  return useContext(StreamConnectionContext);
}
