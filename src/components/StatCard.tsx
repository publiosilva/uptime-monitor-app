import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";

type Accent = "cyan" | "emerald" | "red" | "slate";

export function StatCard({
  label,
  value,
  sub,
  accent = "slate",
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: Accent;
}) {
  const accentColor = {
    cyan: colors.primary,
    emerald: colors.success,
    red: "#f87171",
    slate: "#cbd5e1",
  }[accent];

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  label: {
    fontSize: 10,
    color: "#4a6080",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  sub: {
    fontSize: 12,
    color: colors.dim,
  },
});
