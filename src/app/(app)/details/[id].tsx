import { skipToken, useQuery } from "@apollo/client/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Pause, Play, Trash2 } from "lucide-react-native";

import { Button } from "@/components/Button";
import { DeleteMonitorModal } from "@/components/DeleteMonitorModal";
import { RecentChecks } from "@/components/details/RecentChecks";
import { ResponseLatencyChart } from "@/components/details/ResponseLatencyChart";
import { UptimeTimeline } from "@/components/details/UptimeTimeline";
import { UrlCard } from "@/components/details/UrlCard";
import { StatCard } from "@/components/StatCard";
import { StatusBadge, StatusDot } from "@/components/StatusBadge";
import { colors } from "@/constants/colors";
import { ApiError } from "@/lib/api";
import {
  formatFrequency,
  formatRelativeTime,
  getStatsStatus,
  toDeleteMonitor,
} from "@/lib/monitorHelpers";
import type { MonitorStats } from "@/services/monitor";
import { GET_MONITOR_STATS, monitorService } from "@/services/monitor";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showDelete, setShowDelete] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(
    GET_MONITOR_STATS,
    id ? { variables: { monitor_id: id } } : skipToken,
  );

  async function toggleActive(monitor: MonitorStats) {
    try {
      setIsToggling(true);
      setActionError(null);
      await monitorService.update(monitor.id, {
        name: monitor.name,
        url: monitor.url,
        method: monitor.method,
        frequency: monitor.frequency,
        timeout: monitor.timeout,
        is_active: !monitor.isActive,
      });
      await refetch();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to update monitor");
    } finally {
      setIsToggling(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (error || !data?.getMonitorStats) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={16} color={colors.dim} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error?.message ?? "Monitor not found"}</Text>
        </View>
      </View>
    );
  }

  const monitor = data.getMonitorStats;
  const history = monitor.stats24h?.history ?? [];
  const lastHeartbeat = history[0];
  const status = getStatsStatus(monitor);
  const uptime = monitor.stats24h?.uptimePercentage ?? 0;
  const avgLatency = Math.round(monitor.stats24h?.averageLatencyMs ?? 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={16} color={colors.dim} />
        </Pressable>
        <View style={styles.headerCenter}>
          <StatusDot status={status} />
          <Text style={styles.headerTitle} numberOfLines={1}>
            {monitor.name}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Button
            variant="secondary"
            size="sm"
            disabled={isToggling}
            onPress={() => toggleActive(monitor)}
          >
            {monitor.isActive ? (
              <Pause size={14} color={colors.foreground} />
            ) : (
              <Play size={14} color={colors.foreground} />
            )}
          </Button>
          <Button variant="destructive" size="sm" onPress={() => setShowDelete(true)}>
            <Trash2 size={14} color="#f87171" />
          </Button>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <StatusBadge status={status} />

        {actionError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{actionError}</Text>
          </View>
        ) : null}

        <UrlCard monitor={monitor} />

        <View style={styles.stats}>
          <StatCard
            label="24h Uptime"
            value={`${uptime.toFixed(uptime % 1 === 0 ? 0 : 2)}%`}
            sub="last 24 hours"
            accent={uptime >= 99 ? "emerald" : uptime >= 95 ? "cyan" : "red"}
          />
          <StatCard label="Avg Latency" value={`${avgLatency}ms`} sub="response time" accent="cyan" />
          <StatCard
            label="Last Check"
            value={formatRelativeTime(lastHeartbeat?.createdAt)}
            sub={`every ${formatFrequency(monitor.frequency)}`}
            accent="slate"
          />
          <StatCard
            label="Status Code"
            value={lastHeartbeat?.statusCode ?? "—"}
            sub={
              lastHeartbeat == null ? "—" : lastHeartbeat.isUp ? "OK" : "Service Unavailable"
            }
            accent={lastHeartbeat == null ? "slate" : lastHeartbeat.isUp ? "emerald" : "red"}
          />
        </View>

        <ResponseLatencyChart history={history} />
        <UptimeTimeline history={history} />
        <RecentChecks history={history} />
      </ScrollView>

      {showDelete ? (
        <DeleteMonitorModal
          monitor={toDeleteMonitor(monitor)}
          onClose={() => setShowDelete(false)}
          onDeleted={() => router.replace("/")}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.headerBorder,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 8,
  },
  backText: {
    fontSize: 14,
    color: colors.dim,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.foreground,
    flexShrink: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  errorBox: {
    margin: 16,
    backgroundColor: colors.errorMuted,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.25)",
    borderRadius: 12,
    padding: 14,
  },
  errorText: {
    fontSize: 14,
    color: "#f87171",
  },
});
