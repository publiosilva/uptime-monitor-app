import { StyleSheet, Text, View } from "react-native";
import { Clock } from "lucide-react-native";

import { colors } from "@/constants/colors";
import { chronologicalHistory } from "@/lib/monitorHelpers";
import type { Heartbeat } from "@/services/monitor";

export function UptimeTimeline({ history }: { history: Heartbeat[] }) {
  const timeline = chronologicalHistory(history);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Clock size={14} color={colors.primary} />
          <Text style={styles.title}>Uptime Timeline</Text>
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, styles.up]} />
            <Text style={styles.legendText}>Up</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, styles.down]} />
            <Text style={styles.legendText}>Down</Text>
          </View>
        </View>
      </View>

      {timeline.length === 0 ? (
        <Text style={styles.empty}>No checks in the last 24 hours</Text>
      ) : (
        <>
          <View style={styles.bar}>
            {timeline.map((heartbeat) => (
              <View
                key={heartbeat.id}
                style={[styles.segment, heartbeat.isUp ? styles.up : styles.down]}
              />
            ))}
          </View>
          <View style={styles.labels}>
            <Text style={styles.label}>24h ago</Text>
            <Text style={styles.label}>now</Text>
          </View>
        </>
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
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.foreground,
  },
  legend: {
    flexDirection: "row",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendSwatch: {
    width: 8,
    height: 8,
    borderRadius: 1,
  },
  legendText: {
    fontSize: 12,
    color: colors.dim,
  },
  empty: {
    fontSize: 12,
    color: colors.dim,
    textAlign: "center",
    paddingVertical: 16,
  },
  bar: {
    flexDirection: "row",
    height: 32,
    gap: 1,
  },
  segment: {
    flex: 1,
    borderRadius: 1,
  },
  up: {
    backgroundColor: "rgba(16, 185, 129, 0.65)",
  },
  down: {
    backgroundColor: "rgba(239, 68, 68, 0.7)",
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  label: {
    fontSize: 11,
    fontFamily: "monospace",
    color: colors.dimmest,
  },
});
