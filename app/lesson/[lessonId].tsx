import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import {
  CallingState,
  StreamCall,
  type Call,
} from "@stream-io/video-react-native-sdk";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  fallbackLessonImage,
  images,
  lessonImages,
} from "@/constants/images";
import { useStreamConnection } from "@/components/stream-video-provider";
import { languages } from "@/data/languages";
import { lessons } from "@/data/lessons";
import {
  createStreamLessonCall,
  startVisionAgent,
  stopVisionAgent,
  type StreamCallSession,
  type VisionAgentSession,
} from "@/lib/stream-api";

type SessionPanel = "phrase" | "subtitles";
type AudioCallStatus =
  | "loading"
  | "connecting"
  | "joined"
  | "error"
  | "ended";
type AgentConnectionStatus = "idle" | "connecting" | "connected" | "failed";
type ConversationStatus = "idle" | "listening" | "thinking" | "speaking";
type IconName = React.ComponentProps<typeof Ionicons>["name"];

const AI_TEACHER_USER_ID = "ai-language-teacher";

const feedback = [
  { label: "Speaking", value: "Excellent", color: "#18c92c" },
  { label: "Pronunciation", value: "Great", color: "#1479ff" },
  { label: "Grammar", value: "Good", color: "#6338ff" },
] as const;

export default function AudioLessonScreen() {
  const { getToken } = useAuth();
  const getTokenRef = useRef(getToken);
  const { user } = useUser();
  const callSessionRef = useRef<StreamCallSession | undefined>(undefined);
  const agentSessionRef = useRef<VisionAgentSession | undefined>(undefined);
  const isEndingRef = useRef(false);
  const {
    client,
    error: connectionError,
    retry: retryStreamConnection,
  } = useStreamConnection();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { height } = useWindowDimensions();
  const lesson = lessons.find((item) => item.id === lessonId);
  const language = languages.find((item) => item.id === lesson?.languageId);
  const [call, setCall] = useState<Call>();
  const [callError, setCallError] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<AudioCallStatus>("loading");
  const [agentError, setAgentError] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] =
    useState<AgentConnectionStatus>("idle");
  const [conversationStatus, setConversationStatus] =
    useState<ConversationStatus>("idle");
  const [learnerTranscript, setLearnerTranscript] = useState("");
  const [teacherTranscript, setTeacherTranscript] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const [activePanel, setActivePanel] = useState<SessionPanel>("phrase");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  useEffect(() => {
    if (connectionError && !client) {
      setCallError(connectionError);
      setCallStatus("error");
    }
  }, [client, connectionError]);

  useEffect(() => {
    if (!client || !lesson || !language) {
      return;
    }

    let active = true;
    let lessonCall: Call | undefined;
    let callSession: StreamCallSession | undefined;
    let agentSession: VisionAgentSession | undefined;
    let unsubscribeAgentJoined: (() => void) | undefined;
    let unsubscribeAgentLeft: (() => void) | undefined;
    let unsubscribeAgentEvents: (() => void) | undefined;

    const joinAudioCall = async () => {
      setCallStatus("loading");
      setCallError(null);
      setAgentError(null);
      setAgentStatus("idle");
      setConversationStatus("idle");
      setLearnerTranscript("");
      setTeacherTranscript("");
      isEndingRef.current = false;

      try {
        callSession = await createStreamLessonCall(
          getTokenRef.current,
          lesson.id,
          language.id,
        );

        if (!active) {
          return;
        }

        callSessionRef.current = callSession;
        const newCall = client.call(callSession.callType, callSession.callId, {
          reuseInstance: true,
        });
        lessonCall = newCall;
        unsubscribeAgentJoined = newCall.on(
          "call.session_participant_joined",
          (event) => {
            if (active && event.participant.user.id === AI_TEACHER_USER_ID) {
              setAgentStatus("connected");
            }
          },
        );
        unsubscribeAgentLeft = newCall.on(
          "call.session_participant_left",
          (event) => {
            if (
              active &&
              !isEndingRef.current &&
              event.participant.user.id === AI_TEACHER_USER_ID
            ) {
              setAgentError("The AI teacher disconnected.");
              setAgentStatus("failed");
            }
          },
        );
        unsubscribeAgentEvents = newCall.on("custom", (event) => {
          if (!active) {
            return;
          }

          const custom = event.custom as Record<string, unknown>;

          if (
            custom.type === "lesson.agent_state" &&
            (custom.status === "listening" ||
              custom.status === "thinking" ||
              custom.status === "speaking")
          ) {
            if (custom.status === "speaking" && newCall.microphone.enabled) {
              newCall.microphone.disable().catch(console.error);
              setIsMuted(true);
            }
            setConversationStatus(custom.status);
            return;
          }

          if (
            custom.type !== "lesson.transcript" ||
            typeof custom.text !== "string"
          ) {
            return;
          }

          if (custom.speaker === "learner") {
            setLearnerTranscript(custom.text);
          } else if (custom.speaker === "teacher") {
            setTeacherTranscript(custom.text);
          }
          setActivePanel("subtitles");
        });
        setCall(newCall);
        setCallStatus("connecting");
        await newCall.join({ maxJoinRetries: 1 });
        await newCall.camera.disable();
        await newCall.microphone.disable();

        if (active) {
          setIsMuted(true);
          setCallStatus("joined");
        }
      } catch (error) {
        if (active) {
          setCallError(
            error instanceof Error ? error.message : "Unable to join the call.",
          );
          setCallStatus("error");
        }
        return;
      }

      if (!active || !callSession) {
        return;
      }

      setAgentStatus("connecting");

      try {
        agentSession = await startVisionAgent(getTokenRef.current, callSession);

        if (!active) {
          await stopVisionAgent(
            getTokenRef.current,
            callSession,
            agentSession.sessionId,
          ).catch(console.error);
          return;
        }

        agentSessionRef.current = agentSession;
      } catch (error) {
        if (active) {
          setAgentError(
            error instanceof Error
              ? error.message
              : "Unable to connect the AI teacher.",
          );
          setAgentStatus("failed");
        }
      }
    };

    joinAudioCall();

    return () => {
      active = false;
      unsubscribeAgentJoined?.();
      unsubscribeAgentLeft?.();
      unsubscribeAgentEvents?.();
      const stopAgent =
        callSession && agentSession
          ? stopVisionAgent(
              getTokenRef.current,
              callSession,
              agentSession.sessionId,
            ).catch(console.error)
          : Promise.resolve();

      if (callSessionRef.current?.callId === callSession?.callId) {
        callSessionRef.current = undefined;
      }
      if (agentSessionRef.current?.sessionId === agentSession?.sessionId) {
        agentSessionRef.current = undefined;
      }

      if (
        lessonCall &&
        lessonCall.state.callingState !== CallingState.LEFT
      ) {
        Promise.all([stopAgent, lessonCall.leave()]).catch(console.error);
      } else {
        stopAgent.catch(console.error);
      }
    };
  }, [client, language, lesson, retryKey]);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.screen}>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="font-poppins-semibold text-[20px] text-text-primary">
            Lesson not found
          </Text>
          <Pressable
            className="mt-5 rounded-button bg-lingua-deep-purple px-7 py-4"
            onPress={() => router.back()}
          >
            <Text className="font-poppins-semibold text-white">Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const phrase = lesson.phrases[phraseIndex] ?? lesson.phrases[0];
  const compact = height < 760;

  const showNextPhrase = () => {
    setActivePanel("phrase");
    if (lesson.phrases.length > 0) {
      setPhraseIndex((current) => (current + 1) % lesson.phrases.length);
    }
  };

  const toggleSpeaking = async () => {
    if (!call || callStatus !== "joined") {
      return;
    }

    try {
      if (isMuted) {
        await call.microphone.enable();
        setIsMuted(false);
        setConversationStatus("listening");
        setLearnerTranscript("");
        setActivePanel("subtitles");
      } else {
        await call.microphone.disable();
        setIsMuted(true);
        setConversationStatus("thinking");
      }
    } catch (error) {
      setCallError(
        error instanceof Error ? error.message : "Unable to change speaking mode.",
      );
      setCallStatus("error");
    }
  };

  const endCall = async () => {
    if (!call || callStatus !== "joined") {
      return;
    }

    setCallStatus("ended");
    setAgentStatus("idle");
    setConversationStatus("idle");
    isEndingRef.current = true;

    try {
      const callSession = callSessionRef.current;
      const agentSession = agentSessionRef.current;
      const cleanupTasks: Promise<unknown>[] = [];
      callSessionRef.current = undefined;
      agentSessionRef.current = undefined;

      if (callSession && agentSession) {
        cleanupTasks.push(
          stopVisionAgent(
            getTokenRef.current,
            callSession,
            agentSession.sessionId,
          ),
        );
      }

      if (call.state.callingState !== CallingState.LEFT) {
        cleanupTasks.push(call.leave());
      }

      await Promise.allSettled(cleanupTasks);
    } catch (error) {
      console.error("Unable to leave the audio lesson call.", error);
    } finally {
      router.replace("/(tabs)/learn");
    }
  };

  const callStatusLabel =
    callStatus === "joined" && isMuted
      ? "Ready"
      : {
          loading: "Loading call",
          connecting: "Connecting",
          joined: "Joined",
          error: "Connection error",
          ended: "Call ended",
        }[callStatus];
  const agentStatusLabel = {
    idle: "Idle",
    connecting: "Connecting",
    connected: "Connected",
    failed: "Failed",
  }[agentStatus];
  const agentStatusColor = {
    idle: "#8992af",
    connecting: "#1479ff",
    connected: "#20c718",
    failed: "#ff4048",
  }[agentStatus];
  const conversationStatusLabel = {
    idle: "Waiting for AI teacher",
    listening: isMuted ? "Tap Speak to answer" : "Listening to your answer",
    thinking: "Thinking",
    speaking: "AI teacher speaking",
  }[conversationStatus];
  const speakingDisabled =
    callStatus !== "joined" ||
    agentStatus !== "connected" ||
    conversationStatus === "speaking";

  const screen = (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <View className="flex-row items-center px-5 pb-4 pt-2">
        <Pressable
          accessibilityLabel="Leave audio lesson"
          className="h-12 w-12 items-start justify-center"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={31} color="#0d132b" />
        </Pressable>

        <View className="flex-1 pl-1">
          <Text
            className="font-poppins-semibold text-[20px] leading-7 text-text-primary"
            numberOfLines={1}
          >
            AI Teacher
          </Text>
          <View className="flex-row items-center gap-2">
            <View
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: agentStatusColor }}
            />
            <Text
              className="font-poppins text-[13px] leading-5 text-[#67708f]"
              numberOfLines={1}
            >
              {agentStatusLabel} · {language?.name} · {lesson.title}
            </Text>
          </View>
        </View>

        <View className="h-11 w-11 items-center justify-center rounded-full border border-[#e6e9f1] bg-white">
          <Ionicons name="headset-outline" size={24} color="#0d132b" />
        </View>
        <View className="ml-2 h-11 min-w-11 items-center justify-center rounded-full border border-[#e6e9f1] bg-white px-2">
          <Text className="font-poppins-medium text-[16px] text-text-primary">
            {lesson.estimatedMinutes}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="mx-3 overflow-hidden rounded-[25px] bg-[#d7d1cc]"
          style={[styles.stage, compact && styles.compactStage]}
        >
          <Image
            source={lessonImages[lesson.id] ?? fallbackLessonImage}
            blurRadius={8}
            contentFit="cover"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.stageTint} />

          <View className="absolute left-4 top-4 max-w-[72%] rounded-full bg-white/95 px-4 py-2">
            <Text
              className="font-poppins-medium text-[12px] text-[#4e5678]"
              numberOfLines={1}
            >
              Goal: {lesson.goals[0]?.description}
            </Text>
          </View>

          <Image
            source={images.mascotAuth}
            contentFit="contain"
            style={[styles.mascot, compact && styles.compactMascot]}
          />

          <View className="absolute bottom-4 left-4 right-4 rounded-[22px] bg-white px-5 py-4" style={styles.responseBubble}>
            {activePanel === "phrase" ? (
              <>
                <Text
                  className="font-poppins-medium text-[16px] leading-6 text-text-primary"
                  numberOfLines={2}
                >
                  {phrase?.text ?? lesson.aiTeacherPrompt.openingMessage}
                </Text>
                <Text
                  className="pt-1 font-poppins text-[14px] leading-6 text-[#536080]"
                  numberOfLines={2}
                >
                  {phrase?.translation ?? lesson.aiTeacherPrompt.openingMessage}
                </Text>
              </>
            ) : (
              <>
                <Text
                  className="pr-8 font-poppins-medium text-[14px] leading-6 text-text-primary"
                  numberOfLines={2}
                >
                  {learnerTranscript
                    ? `You: ${learnerTranscript}`
                    : isMuted
                      ? "Tap Speak, say your answer, then tap Stop."
                      : "Listening... tap Stop when you finish."}
                </Text>
                <Text
                  className="pt-1 font-poppins text-[12px] leading-5 text-[#67708f]"
                  numberOfLines={2}
                >
                  {teacherTranscript
                    ? `AI Teacher: ${teacherTranscript}`
                    : conversationStatusLabel}
                </Text>
              </>
            )}
            <Ionicons
              name="volume-high"
              size={25}
              color="#6338ff"
              style={styles.responseAudio}
            />
          </View>
        </View>

        <View
          className="mx-5 mt-5 flex-row items-center rounded-[20px] bg-white px-4 py-3"
          style={styles.callInfoCard}
        >
          <Image
            source={{ uri: user?.imageUrl }}
            contentFit="cover"
            style={styles.userImage}
          />
          <View className="flex-1 px-3">
            <Text
              className="font-poppins-semibold text-[14px] text-text-primary"
              numberOfLines={1}
            >
              {user?.fullName ?? user?.username ?? "Learner"}
            </Text>
            <Text
              className="font-poppins text-[12px] text-[#67708f]"
              numberOfLines={2}
            >
              {agentError ??
                callError ??
                connectionError ??
                `${callStatusLabel} · ${conversationStatusLabel}`}
            </Text>
          </View>
          {(callStatus === "error" || agentStatus === "failed") && (
            <Pressable
              className="rounded-full bg-[#eeeaff] px-4 py-2"
              onPress={() => {
                retryStreamConnection();
                setRetryKey((value) => value + 1);
              }}
            >
              <Text className="font-poppins-semibold text-[12px] text-lingua-deep-purple">
                Retry
              </Text>
            </Pressable>
          )}
        </View>

        <View className="flex-row justify-between px-5 pb-7 pt-9">
          <SessionControl
            icon="chatbubbles"
            label="Phrases"
            onPress={showNextPhrase}
          />
          <SessionControl
            active={!isMuted}
            disabled={speakingDisabled}
            icon={isMuted ? "mic" : "stop-circle"}
            label={isMuted ? "Speak" : "Stop"}
            onPress={toggleSpeaking}
          />
          <SessionControl
            active={activePanel === "subtitles"}
            icon="language"
            label="Subtitles"
            onPress={() =>
              setActivePanel((panel) =>
                panel === "subtitles" ? "phrase" : "subtitles",
              )
            }
          />
          <SessionControl
            danger
            disabled={callStatus !== "joined"}
            icon="call"
            label="End Call"
            onPress={endCall}
          />
        </View>

        <View className="mx-5 flex-row rounded-[22px] bg-white px-1 py-6" style={styles.feedbackCard}>
          {feedback.map((item, index) => (
            <View
              className={`flex-1 items-center px-1 ${
                index > 0 ? "border-l border-[#e9ebf2]" : ""
              }`}
              key={item.label}
            >
              <Text
                className="font-poppins-medium text-[13px] text-text-primary"
                numberOfLines={1}
              >
                {item.label}
              </Text>
              <Text
                className="pt-2 font-poppins-medium text-[14px]"
                style={{ color: item.color }}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

    </SafeAreaView>
  );

  return call ? <StreamCall call={call}>{screen}</StreamCall> : screen;
}

type SessionControlProps = {
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  icon: IconName;
  label: string;
  onPress: () => void;
};

function SessionControl({
  active = false,
  danger = false,
  disabled = false,
  icon,
  label,
  onPress,
}: SessionControlProps) {
  const backgroundColor = danger ? "#ff4048" : active ? "#eeeaff" : "#ffffff";
  const iconColor = danger ? "#ffffff" : active ? "#6338ff" : "#12204b";

  return (
    <Pressable
      accessibilityLabel={label}
      className="items-center"
      disabled={disabled}
      onPress={onPress}
      style={[styles.controlPressable, disabled && styles.disabledControl]}
    >
      <View
        className="h-[72px] w-[72px] items-center justify-center rounded-full"
        style={[styles.controlButton, { backgroundColor }]}
      >
        <Ionicons
          name={icon}
          size={danger ? 35 : 31}
          color={iconColor}
          style={danger ? styles.hangupIcon : undefined}
        />
      </View>
      <Text
        className="pt-3 font-poppins-medium text-[12px] text-[#67708f]"
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f8fb",
  },
  content: {
    paddingBottom: 34,
  },
  stage: {
    height: 465,
    borderCurve: "continuous",
  },
  compactStage: {
    height: 395,
  },
  stageTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(88, 72, 60, 0.18)",
  },
  mascot: {
    position: "absolute",
    left: 5,
    right: 5,
    bottom: 64,
    height: 340,
  },
  compactMascot: {
    height: 280,
    bottom: 58,
  },
  responseBubble: {
    borderCurve: "continuous",
    boxShadow: "0 6px 16px rgba(13, 19, 43, 0.16)",
  },
  responseAudio: {
    position: "absolute",
    right: 18,
    top: 25,
  },
  controlPressable: {
    width: 80,
  },
  controlButton: {
    boxShadow: "0 3px 9px rgba(13, 19, 43, 0.10)",
  },
  disabledControl: {
    opacity: 0.4,
  },
  hangupIcon: {
    transform: [{ rotate: "135deg" }],
  },
  feedbackCard: {
    borderCurve: "continuous",
    boxShadow: "0 4px 15px rgba(13, 19, 43, 0.06)",
  },
  callInfoCard: {
    borderCurve: "continuous",
    boxShadow: "0 3px 12px rgba(13, 19, 43, 0.06)",
  },
  userImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#eeeaff",
  },
});
