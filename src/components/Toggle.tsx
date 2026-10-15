import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type ToggleProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  error?: string;
};

export function Toggle({ label, value, onChange, error }: ToggleProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.row} onPress={() => onChange(!value)}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.track, value && styles.trackOn]}>
          <View style={[styles.thumb, value && styles.thumbOn]} />
        </View>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.mutedForeground,
  },
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.switchBackground,
    padding: 2,
    justifyContent: "flex-start",
  },
  trackOn: {
    backgroundColor: colors.primary,
    justifyContent: "flex-end",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.foreground,
  },
  thumbOn: {
    backgroundColor: colors.primaryForeground,
  },
  error: {
    fontSize: 12,
    color: "#f87171",
  },
});
