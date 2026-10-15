import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Eye, MoreVertical, Pause, Play, Trash2 } from "lucide-react-native";

import { DeleteMonitorModal } from "@/components/DeleteMonitorModal";
import { MethodBadge, StatusBadge, StatusDot } from "@/components/StatusBadge";
import { colors } from "@/constants/colors";
import { formatFrequency, getMonitorStatus } from "@/lib/monitorHelpers";
import type { Monitor } from "@/services/monitor";
import { monitorService } from "@/services/monitor";

export function MonitorCard({
  monitor,
  onDeleted,
  onUpdated,
}: {
  monitor: Monitor;
  onDeleted?: () => void;
  onUpdated?: () => void;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const status = getMonitorStatus(monitor);

  async function toggleActive() {
    setMenuOpen(false);
    try {
      setIsToggling(true);
      await monitorService.update(monitor.id, {
        name: monitor.name,
        url: monitor.url,
        method: monitor.method,
        frequency: monitor.frequency,
        timeout: monitor.timeout,
        is_active: !monitor.is_active,
      });
      onUpdated?.();
    } catch {
      // 401 clears the session via apiRequest
    } finally {
      setIsToggling(false);
    }
  }

  return (
    <>
      <Pressable
        onPress={() => router.push(`/details/${monitor.id}`)}
        style={[styles.card, status === "down" && styles.cardDown]}
      >
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            <StatusDot status={status} />
            <Text style={styles.name} numberOfLines={1}>
              {monitor.name}
            </Text>
          </View>
          <View style={styles.actions}>
            <View
              style={[
                styles.activePill,
                monitor.is_active ? styles.activePillOn : styles.activePillOff,
              ]}
            >
              <Text
                style={[
                  styles.activePillText,
                  monitor.is_active ? styles.activePillTextOn : styles.activePillTextOff,
                ]}
              >
                {monitor.is_active ? "Active" : "Paused"}
              </Text>
            </View>
            <Pressable
              hitSlop={8}
              onPress={(e) => {
                e.stopPropagation?.();
                setMenuOpen(true);
              }}
            >
              <MoreVertical size={14} color={colors.dimmer} />
            </Pressable>
          </View>
        </View>

        <View style={styles.urlRow}>
          <MethodBadge method={monitor.method} />
          <Text style={styles.url} numberOfLines={1}>
            {monitor.url}
          </Text>
        </View>

        <View style={styles.footer}>
          <StatusBadge status={status} />
          <Text style={styles.freq}>Every {formatFrequency(monitor.frequency)}</Text>
        </View>
      </Pressable>

      <Modal visible={menuOpen} transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable style={styles.menuOverlay} onPress={() => setMenuOpen(false)}>
          <View style={styles.menu}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                router.push(`/details/${monitor.id}`);
              }}
            >
              <Eye size={12} color={colors.foreground} />
              <Text style={styles.menuText}>View</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={toggleActive} disabled={isToggling}>
              {monitor.is_active ? (
                <Pause size={12} color={colors.foreground} />
              ) : (
                <Play size={12} color={colors.foreground} />
              )}
              <Text style={styles.menuText}>{monitor.is_active ? "Pause" : "Resume"}</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                setDeleteOpen(true);
              }}
            >
              <Trash2 size={12} color="#f87171" />
              <Text style={[styles.menuText, styles.menuDanger]}>Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {deleteOpen ? (
        <DeleteMonitorModal
          monitor={monitor}
          onClose={() => setDeleteOpen(false)}
          onDeleted={onDeleted}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  cardDown: {
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.foreground,
    flexShrink: 1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  activePillOn: { backgroundColor: "rgba(6, 182, 212, 0.1)" },
  activePillOff: { backgroundColor: "rgba(100, 116, 139, 0.2)" },
  activePillText: { fontSize: 11, fontWeight: "600" },
  activePillTextOn: { color: colors.primary },
  activePillTextOff: { color: "#64748b" },
  urlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  url: {
    flex: 1,
    fontFamily: "monospace",
    fontSize: 12,
    color: "#3a5878",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  freq: {
    fontSize: 12,
    color: colors.dimmer,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  menu: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    minWidth: 160,
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 13,
    color: colors.foreground,
  },
  menuDanger: {
    color: "#f87171",
  },
});
