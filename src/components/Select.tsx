import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ChevronDown } from "lucide-react-native";

import { colors } from "@/constants/colors";

export type SelectOption<T extends string | number = string> = {
  label: string;
  value: T;
};

type SelectProps<T extends string | number> = {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  error?: string;
};

export function Select<T extends string | number>({
  label,
  value,
  options,
  onChange,
  error,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={[styles.trigger, Boolean(error) && styles.triggerError]}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.triggerText}>{selected?.label ?? "Select"}</Text>
        <ChevronDown size={16} color={colors.dim} />
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <ScrollView>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    key={String(option.value)}
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.mutedForeground,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
  },
  triggerError: {
    borderColor: "rgba(239, 68, 68, 0.5)",
  },
  triggerText: {
    color: colors.foreground,
    fontSize: 14,
  },
  error: {
    fontSize: 12,
    color: "#f87171",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 24,
  },
  sheet: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    maxHeight: 360,
    padding: 12,
  },
  sheetTitle: {
    color: colors.foreground,
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: colors.hover,
  },
  optionText: {
    color: colors.mutedForeground,
    fontSize: 14,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: "600",
  },
});
