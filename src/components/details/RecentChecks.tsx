import { StyleSheet, Text, View } from "react-native";
import { CheckCircle, XCircle } from "lucide-react-native";

import { colors } from "@/constants/colors";
import { formatCheckTime } from "@/lib/monitorHelpers";
import type { Heartbeat } from "@/services/monitor";

export function RecentChecks({ history }: { history: Heartbeat[] }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Checks</Text>
        <Text style={styles.count}>{history.length} results</Text>
      </View>

      <View style={styles.tableHeader}>
        {["Time", "Status", "Code", "Latency"].map((header) => (
          <Text key={header} style={[styles.th, header === "Time" && styles.colTime]}>
            {header}
          </Text>
        ))}
      </View>

      {history.length === 0 ? (
        <Text style={styles.empty}>No checks yet</Text>
      ) : (
        history.slice(0, 30).map((check) => (
          <View key={check.id} style={styles.row}>
            <Text style={[styles.td, styles.colTime, styles.mono]}>{formatCheckTime(check.createdAt)}</Text>
            <View style={[styles.td, styles.statusCell]}>
              {check.isUp ? (
                <>
                  <CheckCircle size={12} color={colors.success} />
                  <Text style={styles.upText}>Up</Text>
                </>
              ) : (
                <>
                  <XCircle size={12} color="#f87171" />
                  <Text style={styles.downText}>Down</Text>
                </>
              )}
            </View>
            <Text
              style={[
                styles.td,
                styles.mono,
                check.statusCode >= 200 && check.statusCode < 400 ? styles.upText : styles.downText,
              ]}
            >
              {check.statusCode || "—"}
            </Text>
            <Text style={[styles.td, styles.mono, styles.latency]}>{check.latencyMs}ms</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.foreground,
  },
  count: {
    fontSize: 12,
    fontFamily: "monospace",
    color: colors.dim,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.headerBorder,
  },
  th: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
    color: colors.dim,
  },
  colTime: { flex: 1.2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#0f1c2e",
  },
  td: {
    flex: 1,
    fontSize: 12,
    color: colors.mutedForeground,
  },
  mono: { fontFamily: "monospace" },
  statusCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  upText: { color: colors.success, fontSize: 12 },
  downText: { color: "#f87171", fontSize: 12 },
  latency: { color: colors.mutedForeground },
  empty: {
    fontSize: 12,
    color: colors.dim,
    textAlign: "center",
    paddingVertical: 24,
  },
});
