import { Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { operations } from "@/domain/operations";
import { homeRouteForUser } from "@/domain/authRoutes";
import { Button, Container, GlassButton, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

const ROLES = [
  { id: "user-1", label: "Seller", testID: "sign-in-role-seller" },
  { id: "user-7", label: "Buyer", testID: "sign-in-role-buyer" },
  { id: "user-9", label: "Renter", testID: "sign-in-role-renter" },
  { id: "user-admin", label: "Admin", testID: "sign-in-role-admin" },
] as const;

export default function SignInScreen() {
  const router = useRouter();

  return (
    <Screen testID="sign-in">
      <Container>
        <Text style={styles.title}>Continue as demo user</Text>
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
        <Button label="Back to browse" onPress={() => router.push("/browse")} />
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
