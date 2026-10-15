import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { colors } from "@/constants/colors";

type ButtonVariant = "primary" | "secondary" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.primaryForeground : colors.foreground} />
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </Pressable>
  );
}

export function ButtonText({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
}) {
  return <Text style={[styles.text, textVariantStyles[variant]]}>{children}</Text>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontWeight: "600",
  },
});

const sizeStyles = StyleSheet.create({
  sm: { paddingHorizontal: 12, paddingVertical: 6 },
  md: { paddingHorizontal: 16, paddingVertical: 8 },
  lg: { paddingHorizontal: 20, paddingVertical: 12 },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  destructive: {
    backgroundColor: colors.errorMuted,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.25)",
  },
});

const textVariantStyles = StyleSheet.create({
  primary: { color: colors.primaryForeground, fontSize: 14 },
  secondary: { color: colors.foreground, fontSize: 14 },
  destructive: { color: "#f87171", fontSize: 14 },
});
