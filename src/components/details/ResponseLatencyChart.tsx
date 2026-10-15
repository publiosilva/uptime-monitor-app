import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Zap } from "lucide-react-native";

import { colors } from "@/constants/colors";
import { chronologicalHistory } from "@/lib/monitorHelpers";
import type { Heartbeat } from "@/services/monitor";

function formatTickTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function ResponseLatencyChart({ history }: { history: Heartbeat[] }) {
  const { width } = useWindowDimensions();
  const data = chronologicalHistory(history).map((heartbeat) => ({
    value: heartbeat.latencyMs,
    label: formatTickTime(heartbeat.createdAt),
  }));

  // Show fewer labels on small screens
  const labeled = data.map((point, index) => ({
    ...point,
    label: index % Math.max(1, Math.ceil(data.length / 4)) === 0 ? point.label : "",
  }));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Zap size={14} color={colors.primary} />
          <Text style={styles.title}>Response Latency</Text>
        </View>
        <Text style={styles.sub}>Last 24 hours</Text>
      </View>

      {labeled.length === 0 ? (
        <Text style={styles.empty}>No latency data yet</Text>
      ) : (
        <LineChart
          data={labeled}
          width={width - 80}
          height={140}
          color={colors.chart}
          thickness={1.5}
          hideDataPoints
          curved
          areaChart
          startFillColor="rgba(6, 182, 212, 0.2)"
          endFillColor="rgba(6, 182, 212, 0.01)"
          startOpacity={0.4}
          endOpacity={0.05}
          yAxisColor="transparent"
          xAxisColor="transparent"
          yAxisTextStyle={styles.axis}
          xAxisLabelTextStyle={styles.axis}
          rulesColor={colors.headerBorder}
          rulesType="dashed"
          noOfSections={4}
          yAxisLabelSuffix="ms"
          initialSpacing={8}
          endSpacing={8}
          adjustToWidth
        />
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
    marginBottom: 16,
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
  sub: {
    fontSize: 12,
    fontFamily: "monospace",
    color: colors.dim,
  },
  empty: {
    fontSize: 12,
    color: colors.dim,
    textAlign: "center",
    paddingVertical: 40,
  },
  axis: {
    color: colors.dimmer,
    fontSize: 9,
    fontFamily: "monospace",
  },
});
