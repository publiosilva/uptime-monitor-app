import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { colors } from "@/constants/colors";

type InputProps = TextInputProps & {
  label: string;
  error?: string;
};

export function Input({ label, error, style, ...props }: InputProps) {
  const hasError = Boolean(error);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.dim}
        style={[styles.input, hasError && styles.inputError, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.mutedForeground,
    letterSpacing: 0.3,
  },
  input: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    color: colors.foreground,
  },
  inputError: {
    borderColor: "rgba(239, 68, 68, 0.5)",
  },
  error: {
    fontSize: 12,
    color: "#f87171",
  },
});
