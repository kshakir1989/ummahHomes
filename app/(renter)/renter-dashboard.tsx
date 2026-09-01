import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { browsePath } from "@/domain/authRoutes";
import { operations } from "@/domain/operations";
import { RequestStatus } from "@/domain/types";
import { getSession, hasRole } from "@/store/session";
import { Button, Container, Screen } from "@/ui";
import { colors, spacing } from "@/ui/theme";

export default function RenterDashboardScreen() {
  const session = getSession();
  const router = useRouter();

  const stats = useMemo(() => {
    if (!session) {
      return { applications: 0, awaiting: 0, threads: 0 };
    }
    const applications = operations.listMyApplications();
    const awaiting = applications.filter(
      (item) => item.status === RequestStatus.Submitted,
    ).length;
    const threads = operations.listMyThreads().length;
    return { applications: applications.length, awaiting, threads };
  }, [session]);

  if (!session || !hasRole(session, "renter")) {
    router.replace("/sign-in");
    return null;
  }

  return (
    <Screen testID="renter-dashboard">
      <Container>
        <Text style={styles.heading}>Renter dashboard</Text>
        <Text style={styles.subheading}>
          Welcome back, {session.displayName}. Browse rentals and track your
          applications.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.applications}</Text>
            <Text style={styles.statLabel}>My applications</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.awaiting}</Text>
            <Text style={styles.statLabel}>Awaiting seller</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.threads}</Text>
            <Text style={styles.statLabel}>Conversations</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            label="Browse rentals"
            onPress={() => router.push(browsePath())}
            testID="renter-dashboard-browse"
          />
          <Button
            label="My applications"
            variant="secondary"
            onPress={() => router.push("/my-applications")}
            testID="renter-dashboard-applications"
          />
          <Button
            label="Messages"
            variant="outline"
            onPress={() => router.push("/renter-inbox")}
            testID="renter-dashboard-inbox"
          />
          {hasRole(session, "seller") ? (
            <Button
              label="Seller dashboard"
              variant="outline"
              onPress={() => router.push("/dashboard")}
              testID="renter-dashboard-seller-link"
            />
          ) : null}
        </View>
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: spacing.sm,
    color: colors.text,
  },
  subheading: {
    color: colors.brownMid,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.brownWarm,
    padding: spacing.md,
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
  },
  statLabel: {
    color: colors.brownMid,
    fontSize: 12,
  },
  actions: {
    gap: spacing.sm,
  },
});
