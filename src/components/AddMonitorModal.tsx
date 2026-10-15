import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { X } from "lucide-react-native";
import { z } from "zod";

import { Button, ButtonText } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Toggle } from "@/components/Toggle";
import { colors } from "@/constants/colors";
import { ApiError } from "@/lib/api";
import { monitorService } from "@/services/monitor";

const addMonitorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"]),
  frequency: z.number().min(30, "Frequency is required"),
  is_active: z.boolean(),
});

type AddMonitorForm = z.infer<typeof addMonitorSchema>;

const methodOptions = [
  { label: "GET", value: "GET" as const },
  { label: "POST", value: "POST" as const },
  { label: "PUT", value: "PUT" as const },
  { label: "PATCH", value: "PATCH" as const },
  { label: "DELETE", value: "DELETE" as const },
  { label: "HEAD", value: "HEAD" as const },
];

const frequencyOptions = [
  { label: "Every 30s", value: 30 },
  { label: "Every 1m", value: 60 },
  { label: "Every 5m", value: 300 },
  { label: "Every 10m", value: 600 },
  { label: "Every 30m", value: 1800 },
  { label: "Every 1h", value: 3600 },
];

export function AddMonitorModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated?: () => void;
}) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddMonitorForm>({
    resolver: zodResolver(addMonitorSchema),
    defaultValues: {
      name: "",
      url: "",
      method: "GET",
      frequency: 60,
      is_active: true,
    },
  });

  async function onSubmit(data: AddMonitorForm) {
    setSubmitError(null);
    try {
      await monitorService.create(data);
      onCreated?.();
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
        return;
      }
      setSubmitError("Something went wrong. Please try again.");
    }
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Monitor</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={16} color={colors.dim} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {submitError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{submitError}</Text>
              </View>
            ) : null}

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Name"
                  placeholder="Production API"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="url"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="URL"
                  placeholder="https://api.example.com/health"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.url?.message}
                />
              )}
            />
            <View style={styles.row}>
              <Controller
                control={control}
                name="method"
                render={({ field: { onChange, value } }) => (
                  <Select
                    label="Method"
                    value={value}
                    options={methodOptions}
                    onChange={onChange}
                    error={errors.method?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="frequency"
                render={({ field: { onChange, value } }) => (
                  <Select
                    label="Frequency"
                    value={value}
                    options={frequencyOptions}
                    onChange={onChange}
                    error={errors.frequency?.message}
                  />
                )}
              />
            </View>
            <Controller
              control={control}
              name="is_active"
              render={({ field: { onChange, value } }) => (
                <Toggle
                  label="Active"
                  value={value}
                  onChange={onChange}
                  error={errors.is_active?.message}
                />
              )}
            />
            <View style={styles.actions}>
              <Button variant="secondary" onPress={onClose} style={styles.flex}>
                <ButtonText variant="secondary">Cancel</ButtonText>
              </Button>
              <Button
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                loading={isSubmitting}
                style={styles.flex}
              >
                <ButtonText>{isSubmitting ? "Creating…" : "Create Monitor"}</ButtonText>
              </Button>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: "90%",
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
  row: {
    flexDirection: "row",
    gap: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 4,
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
