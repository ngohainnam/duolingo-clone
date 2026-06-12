import { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
  email: string;
}

export function VerificationModal({
  visible,
  onClose,
  onVerify,
  email,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (code.length !== 6 || isVerifying) {
      return;
    }

    setIsVerifying(true);

    void onVerify(code)
      .then((wasVerified) => {
        if (wasVerified) {
          setCode("");
          onClose();
        } else {
          setCode("");
          inputRef.current?.focus();
        }
      })
      .catch((error) => {
        console.error("Verification failed", error);
        setCode("");
        inputRef.current?.focus();
      })
      .finally(() => setIsVerifying(false));
  }, [code, isVerifying, onClose, onVerify]);

  const handleChange = (text: string) => {
    setCode(text.replace(/[^0-9]/g, "").slice(0, 6));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onShow={() => inputRef.current?.focus()}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        {/* Backdrop */}
        <Pressable
          style={[StyleSheet.absoluteFill, styles.backdrop]}
          onPress={onClose}
        />

        {/* Bottom sheet above keyboard */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.kavWrapper}
        >
          <View style={styles.sheet}>
            {/* Handle bar */}
            <View style={styles.handle} />

            <Text className="font-poppins-bold text-[22px] text-text-primary">
              Check your email
            </Text>
            <Text className="mt-2 font-poppins text-[15px] leading-6 text-text-secondary">
              We sent a 6-digit verification code to{"\n"}
              <Text className="font-poppins-medium text-text-primary">
                {email || "your email"}
              </Text>
            </Text>

            {/* Code cells */}
            <Pressable
              onPress={() => inputRef.current?.focus()}
              style={styles.cellsRow}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.cell,
                    i === code.length && styles.cellActive,
                    !!code[i] && styles.cellFilled,
                  ]}
                >
                  <Text className="font-poppins-bold text-[24px] text-text-primary">
                    {code[i] ?? ""}
                  </Text>
                </View>
              ))}
            </Pressable>

            {/* Hidden input that drives the code cells */}
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleChange}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.hiddenInput}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  kavWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 52,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 24,
  },
  cellsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 32,
  },
  cell: {
    flex: 1,
    height: 60,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#F6F7FB",
    alignItems: "center",
    justifyContent: "center",
  },
  cellActive: {
    borderColor: "#5B3BF6",
    backgroundColor: "#ffffff",
  },
  cellFilled: {
    borderColor: "#5B3BF6",
    backgroundColor: "#ffffff",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
});
