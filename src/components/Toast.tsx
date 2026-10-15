import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AlertCircle, CheckCircle, X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/constants/colors";

export type ToastType = "error" | "success" | "info";

export function Toast({
  message,
  type,
  onDismiss,
}: {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icon =
    type === "success" ? (
      <CheckCircle size={16} color={colors.success} />
    ) : type === "error" ? (
      <AlertCircle size={16} color="#f87171" />
    ) : (
      <AlertCircle size={16} color={colors.primary} />
    );

  const borderColor =
    type === "success"
      ? "rgba(16, 185, 129, 0.3)"
      : type === "error"
        ? "rgba(239, 68, 68, 0.3)"
        : "rgba(6, 182, 212, 0.3)";

  return (
    <View style={[styles.container, { bottom: insets.bottom + 20, borderColor }]}>
      {icon}
      <Text style={styles.message}>{message}</Text>
      <Pressable onPress={onDismiss} hitSlop={8}>
        <X size={14} color={colors.dim} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: colors.foreground,
    lineHeight: 18,
  },
});
