import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Activity, LogOut, Plus } from "lucide-react-native";

import { AddMonitorModal } from "@/components/AddMonitorModal";
import { Button, ButtonText } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { MonitorCard } from "@/components/MonitorCard";
import { StatCard } from "@/components/StatCard";
import { Toast } from "@/components/Toast";
import { colors } from "@/constants/colors";
import { useSession } from "@/contexts/session";
import { useWebSocket } from "@/hooks/useWebSocket";
import { WS_URL } from "@/lib/config";
import { getToken } from "@/lib/token";
import type { Monitor } from "@/services/monitor";
import { monitorService } from "@/services/monitor";

type MonitorStateMessage = {
  monitor_name: string;
  monitorId: string;
  is_up: boolean;
  timestamp: number;
};

type ToastState = {
  id: number;
  message: string;
  type: "error" | "success";
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { signOut, session } = useSession();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const token = session ?? getToken();
  const wsUrl = token ? `${WS_URL}?token=${token}` : null;

  const { isConnected } = useWebSocket(wsUrl, (raw) => {
    try {
      const payload = JSON.parse(raw) as MonitorStateMessage;
      if (
        typeof payload.monitor_name !== "string" ||
        typeof payload.monitorId !== "string" ||
        typeof payload.is_up !== "boolean"
      ) {
        return;
      }

      setMonitors((prev) =>
        prev.map((m) => (m.id === payload.monitorId ? { ...m, is_up: payload.is_up } : m)),
      );

      setToast({
        id: Date.now(),
        message: payload.is_up
          ? `${payload.monitor_name} is back UP`
          : `${payload.monitor_name} is DOWN`,
        type: payload.is_up ? "success" : "error",
      });
    } catch {
      // Ignore malformed messages
    }
  });

  const loadMonitors = useCallback(async () => {
    try {
      const data = await monitorService.list();
      setMonitors(data);
    } catch {
      // 401 clears the session via apiRequest; other failures leave the current list
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    monitorService
      .list()
      .then((data) => {
        if (!cancelled) setMonitors(data);
      })
      .catch(() => {
        // 401 is handled by setUnauthorizedHandler → redirect to sign-in
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await loadMonitors();
    } finally {
      setRefreshing(false);
    }
  }

  const qtdMonitors = monitors.length;
  const qtdMonitorsUp = monitors.filter((m) => m.is_active && m.is_up).length;
  const qtdMonitorsDown = monitors.filter((m) => m.is_active && !m.is_up).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <Logo size={28} />
          <Text style={styles.brandText}>uptime</Text>
          <Text style={styles.version}>v1.0.0</Text>
        </View>
        <View style={styles.headerActions}>
          <Button size="sm" onPress={() => setIsAddOpen(true)}>
            <Plus size={14} color={colors.primaryForeground} />
            <ButtonText>Add</ButtonText>
          </Button>
          <Pressable onPress={() => signOut()} style={styles.logout} hitSlop={8}>
            <LogOut size={14} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={monitors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.stats}>
              <StatCard label="Total" value={qtdMonitors} sub="monitors configured" accent="slate" />
              <StatCard label="Operational" value={qtdMonitorsUp} sub="online now" accent="emerald" />
              <StatCard
                label="Down"
                value={qtdMonitorsDown}
                sub={qtdMonitorsDown > 0 ? "requires attention" : "all systems go"}
                accent={qtdMonitorsDown > 0 ? "red" : "slate"}
              />
            </View>

            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Monitors</Text>
                <Text style={styles.count}>({qtdMonitors})</Text>
              </View>
              <View style={styles.liveRow}>
                <View style={[styles.liveDot, isConnected ? styles.liveDotOn : styles.liveDotOff]} />
                <Text style={styles.liveText}>
                  {isConnected ? "Live checks running" : "Connecting…"}
                </Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.empty}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Activity size={28} color={colors.dimmer} />
              </View>
              <Text style={styles.emptyTitle}>No monitors configured</Text>
              <Text style={styles.emptySub}>Add your first URL to start tracking uptime</Text>
              <Button onPress={() => setIsAddOpen(true)}>
                <Plus size={14} color={colors.primaryForeground} />
                <ButtonText>Add your first monitor</ButtonText>
              </Button>
            </View>
          )
        }
        renderItem={({ item }) => (
          <MonitorCard monitor={item} onDeleted={loadMonitors} onUpdated={loadMonitors} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {isAddOpen ? (
        <AddMonitorModal onClose={() => setIsAddOpen(false)} onCreated={loadMonitors} />
      ) : null}

      {toast ? (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.headerBorder,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.foreground,
  },
  version: {
    fontSize: 11,
    fontFamily: "monospace",
    color: colors.dimmer,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logout: {
    padding: 8,
    borderRadius: 8,
  },
  list: {
    padding: 16,
    gap: 0,
  },
  listHeader: {
    gap: 20,
    marginBottom: 16,
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#cbd5e1",
  },
  count: {
    fontSize: 12,
    fontFamily: "monospace",
    color: colors.dimmer,
  },
  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveDotOn: { backgroundColor: colors.success },
  liveDotOff: { backgroundColor: "#64748b" },
  liveText: {
    fontSize: 12,
    color: colors.dimmer,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mutedForeground,
  },
  emptySub: {
    fontSize: 12,
    color: colors.dimmer,
    marginBottom: 8,
  },
});
