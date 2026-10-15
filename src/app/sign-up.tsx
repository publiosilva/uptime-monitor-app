import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

import { Button, ButtonText } from "@/components/Button";
import { GridBackground } from "@/components/GridBackground";
import { Input } from "@/components/Input";
import { Logo } from "@/components/Logo";
import { colors } from "@/constants/colors";
import { useSession } from "@/contexts/session";
import { ApiError } from "@/lib/api";

const signUpSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const { signUp } = useSession();
  const insets = useSafeAreaInsets();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(data: SignUpForm) {
    setSubmitError(null);
    try {
      await signUp(data.email, data.password);
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
        return;
      }
      setSubmitError("Something went wrong. Please try again.");
    }
  }

  return (
    <View style={styles.container}>
      <GridBackground />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brand}>
            <Logo />
            <Text style={styles.brandText}>uptime</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Start monitoring in under 2 minutes</Text>

            {submitError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{submitError}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email address"
                    placeholder="example@email.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="••••••••"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Confirm password"
                    placeholder="••••••••"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmPassword?.message}
                  />
                )}
              />
              <Button onPress={handleSubmit(onSubmit)} size="lg" loading={isSubmitting} disabled={isSubmitting}>
                <ButtonText>{isSubmitting ? "Creating account…" : "Create account"}</ButtonText>
              </Button>
            </View>

            <Text style={styles.footer}>
              Already have an account?{" "}
              <Link href="/sign-in" style={styles.link}>
                Sign in
              </Link>
            </Text>
          </View>

          <Text style={styles.meta}>Self-hosted · Open source · No telemetry</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 24,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  brandText: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.foreground,
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.foreground,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.dim,
    marginBottom: 24,
  },
  form: { gap: 16 },
  errorBox: {
    backgroundColor: colors.errorMuted,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  errorText: { fontSize: 12, color: "#f87171" },
  footer: {
    fontSize: 12,
    color: colors.dim,
    textAlign: "center",
    marginTop: 20,
  },
  link: { color: colors.primary, fontWeight: "600" },
  meta: {
    textAlign: "center",
    fontSize: 12,
    color: colors.dimmest,
  },
});
