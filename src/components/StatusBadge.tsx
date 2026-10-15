import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/colors";
import type { Status } from "@/lib/monitorHelpers";
import type { Monitor } from "@/services/monitor";

export function StatusDot({ status }: { status: Status }) {
  const color =
    status === "up" ? colors.success : status === "down" ? "#f87171" : "#64748b";

  return (
    <View style={styles.dotWrap}>
      {status === "down" ? <View style={[styles.ping, { backgroundColor: color }]} /> : null}
      <View style={[styles.dot, { backgroundColor: color }]} />
    </View>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const cfg = {
    up: {
      label: "Operational",
      bg: colors.successMuted,
      border: "rgba(16, 185, 129, 0.25)",
      text: colors.success,
    },
    down: {
      label: "Down",
      bg: colors.errorMuted,
      border: "rgba(239, 68, 68, 0.25)",
      text: "#f87171",
    },
    paused: {
      label: "Paused",
      bg: "rgba(100, 116, 139, 0.1)",
      border: "rgba(100, 116, 139, 0.25)",
      text: "#64748b",
    },
  }[status];

  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <StatusDot status={status} />
      <Text style={[styles.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

export function MethodBadge({ method }: { method: Monitor["method"] }) {
  const palette: Record<Monitor["method"], { text: string; bg: string }> = {
    GET: { text: colors.success, bg: "rgba(52, 211, 153, 0.1)" },
    POST: { text: "#38bdf8", bg: "rgba(56, 189, 248, 0.1)" },
    PUT: { text: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)" },
    PATCH: { text: "#fb923c", bg: "rgba(251, 146, 60, 0.1)" },
    DELETE: { text: "#f87171", bg: "rgba(248, 113, 113, 0.1)" },
    HEAD: { text: "#a78bfa", bg: "rgba(167, 139, 250, 0.1)" },
  };
  const style = palette[method];

  return (
    <View style={[styles.method, { backgroundColor: style.bg }]}>
      <Text style={[styles.methodText, { color: style.text }]}>{method}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dotWrap: {
    width: 8,
    height: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  ping: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  method: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  methodText: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 0.4,
  },
});
