import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { operations } from "@/domain/operations";
import { homeRouteForUser } from "@/domain/authRoutes";
import { Button, Container, GlassButton, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

const ROLES = [
  { id: "user-1", label: "Seller", testID: "sign-up-role-seller" },
  { id: "user-7", label: "Buyer", testID: "sign-up-role-buyer" },
  { id: "user-9", label: "Renter", testID: "sign-up-role-renter" },
] as const;

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <Screen testID="sign-up">
      <Container>
        <Text style={styles.title}>Create your demo account</Text>
        <Text style={styles.subtitle}>
          Choose how you want to use ummahHomes in this demo.
        </Text>
        {ROLES.map((role) => (
          <GlassButton
            key={role.id}
            testID={role.testID}
            label={role.label}
            style={styles.role}
            onPress={() => {
              const user = operations.signIn(role.id);
              router.replace(homeRouteForUser(user));
            }}
          />
        ))}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/sign-in" asChild>
            <GlassButton
              label="Sign in"
              compact
              testID="sign-up-go-sign-in"
            />
          </Link>
        </View>
        <Button label="Back to home" onPress={() => router.push("/")} />
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.sm,
    color: colors.text,
  },
  subtitle: {
    color: colors.brownMid,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  role: {
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  footerText: {
    color: colors.brownMid,
  },
});
