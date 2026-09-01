import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { operations } from "@/domain/operations";
import { signInSuccessRoute } from "@/domain/authRoutes";
import { needsRolePicker } from "@/store/session";
import { Button, Container, GlassButton, ScreenScroll } from "@/ui";
import { colors, spacing } from "@/ui/theme";

const ROLES = [
  { id: "user-1", label: "Seller + Buyer", testID: "sign-in-role-seller" },
  { id: "user-7", label: "Buyer", testID: "sign-in-role-buyer" },
  { id: "user-9", label: "Renter", testID: "sign-in-role-renter" },
  { id: "user-admin", label: "Admin", testID: "sign-in-role-admin" },
] as const;

export default function SignInScreen() {
  const router = useRouter();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();

  const onSignIn = (userId: string) => {
    const user = operations.signIn(userId);
    if (needsRolePicker(user)) {
      const pickerPath = returnTo
        ? `/role-picker?returnTo=${encodeURIComponent(returnTo)}`
        : "/role-picker";
      router.replace(pickerPath as never);
      return;
    }
    router.replace(signInSuccessRoute(user, returnTo) as never);
  };

  return (
    <ScreenScroll testID="sign-in" contentContainerStyle={styles.scroll}>
      <Container>
        <Text style={styles.title}>Continue as demo user</Text>
        {ROLES.map((role) => (
          <GlassButton
            key={role.id}
            testID={role.testID}
            label={role.label}
            style={styles.role}
            onPress={() => onSignIn(role.id)}
          />
        ))}
        <Button label="Back to browse" onPress={() => router.push("/browse")} />
      </Container>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.md,
    color: colors.text,
  },
  role: {
    marginBottom: spacing.sm,
  },
});
