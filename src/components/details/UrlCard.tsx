import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Check, Copy } from "lucide-react-native";

import { MethodBadge } from "@/components/StatusBadge";
import { colors } from "@/constants/colors";
import { formatFrequency } from "@/lib/monitorHelpers";
import type { MonitorStats } from "@/services/monitor";

export function UrlCard({ monitor }: { monitor: MonitorStats }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await Clipboard.setStringAsync(monitor.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const meta: [string, string][] = [
    ["Frequency", formatFrequency(monitor.frequency)],
    ["Timeout", `${monitor.timeout}s`],
    ["Created", monitor.createdAt],
    ["Status", monitor.isActive ? "Active" : "Paused"],
  ];

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <MethodBadge method={monitor.method} />
        <Text style={styles.url} numberOfLines={2}>
          {monitor.url}
        </Text>
        <Pressable onPress={handleCopy} style={styles.copyBtn} hitSlop={8}>
          {copied ? (
            <>
              <Check size={12} color={colors.success} />
              <Text style={styles.copied}>Copied</Text>
            </>
          ) : (
            <>
              <Copy size={12} color={colors.dim} />
              <Text style={styles.copyText}>Copy</Text>
            </>
          )}
        </Pressable>
      </View>
      <View style={styles.meta}>
        {meta.map(([label, value]) => (
          <Text key={label} style={styles.metaItem}>
            {label}: <Text style={styles.metaValue}>{value}</Text>
          </Text>
        ))}
      </View>
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
    gap: 12,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  url: {
    flex: 1,
    fontFamily: "monospace",
    fontSize: 13,
    color: "#cbd5e1",
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 6,
  },
  copyText: { fontSize: 12, color: colors.dim },
  copied: { fontSize: 12, color: colors.success },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metaItem: {
    fontSize: 12,
    color: colors.dim,
  },
  metaValue: {
    color: colors.mutedForeground,
    fontFamily: "monospace",
  },
});
