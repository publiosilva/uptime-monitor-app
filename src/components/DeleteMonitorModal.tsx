import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Trash2, X } from "lucide-react-native";

import { Button, ButtonText } from "@/components/Button";
import { colors } from "@/constants/colors";
import { ApiError } from "@/lib/api";
import type { Monitor } from "@/services/monitor";
import { monitorService } from "@/services/monitor";

export function DeleteMonitorModal({
  monitor,
  onClose,
  onDeleted,
}: {
  monitor: Monitor;
  onClose: () => void;
  onDeleted?: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    try {
      setIsDeleting(true);
      setError(null);
      await monitorService.delete(monitor.id);
      onDeleted?.();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Delete Monitor</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={16} color={colors.dim} />
            </Pressable>
          </View>
          <View style={styles.body}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            <Text style={styles.message}>
              Delete <Text style={styles.strong}>{monitor.name}</Text>? This cannot be undone and
              all check history will be lost.
            </Text>
            <Text style={styles.url} numberOfLines={1}>
              {monitor.url}
            </Text>
            <View style={styles.actions}>
              <Button variant="secondary" onPress={onClose} style={styles.flex}>
                <ButtonText variant="secondary">Cancel</ButtonText>
              </Button>
              <Button
                variant="destructive"
                onPress={onDelete}
                disabled={isDeleting}
                loading={isDeleting}
                style={styles.flex}
              >
                <Trash2 size={14} color="#f87171" />
                <ButtonText variant="destructive">{isDeleting ? "Deleting…" : "Delete"}</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 16,
  },
  sheet: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.foreground,
  },
  body: {
    padding: 20,
    gap: 16,
  },
  message: {
    fontSize: 14,
    color: colors.mutedForeground,
    lineHeight: 20,
  },
  strong: {
    color: colors.foreground,
    fontWeight: "600",
  },
  url: {
    fontFamily: "monospace",
    fontSize: 12,
    color: colors.dim,
    backgroundColor: colors.input,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  flex: { flex: 1 },
  errorBox: {
    backgroundColor: colors.errorMuted,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 8,
    padding: 10,
  },
  errorText: { fontSize: 12, color: "#f87171" },
});
