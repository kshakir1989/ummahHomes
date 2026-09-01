import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { User } from "@/domain/types";
import { homeRouteForActiveRole } from "@/domain/authRoutes";
import { setActiveRole } from "@/store/session";
import { Button } from "./Button";
import { Container, Screen } from "./Layout";
import { GlassButton } from "./GlassButton";
import { colors, spacing } from "@/ui/theme";

const ROLE_OPTIONS: { role: User["roles"][number]; label: string; testID: string }[] = [
  { role: "seller", label: "Seller", testID: "role-picker-seller" },
  { role: "buyer", label: "Buyer", testID: "role-picker-buyer" },
  { role: "renter", label: "Renter", testID: "role-picker-renter" },
  { role: "admin", label: "Admin", testID: "role-picker-admin" },
];

export interface RolePickerScreenProps {
  user: User;
  returnTo?: string;
}

export function RolePickerScreen({ user, returnTo }: RolePickerScreenProps) {
  const router = useRouter();
  const options = ROLE_OPTIONS.filter((item) => user.roles.includes(item.role));

  return (
    <Screen testID="role-picker">
      <Container>
        <Text style={styles.title}>How are you using Ummah Homes today?</Text>
        <Text style={styles.subtitle}>
          Signed in as {user.displayName}. Choose a role to continue.
        </Text>
        {options.map((item) => (
          <GlassButton
            key={item.role}
            testID={item.testID}
            label={item.label}
            style={styles.role}
            onPress={() => {
              setActiveRole(item.role);
              if (returnTo) {
                router.replace(returnTo as never);
                return;
              }
              router.replace(homeRouteForActiveRole(user, item.role) as never);
            }}
          />
        ))}
        <Button label="Sign out" variant="outline" onPress={() => router.replace("/sign-in")} />
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
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  role: {
    marginBottom: spacing.sm,
  },
});
