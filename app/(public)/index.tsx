import { useRef } from "react";
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  MARKETING_COMMUNITY_IMAGE,
  MARKETING_DRONE_NEIGHBORHOOD,
  MARKETING_HERO_IMAGE,
  MARKETING_SAFE_HOME_IMAGE,
} from "../../data/listing-catalog";
import { Container, GlassNavLink, GlassText, HeroDiscoverNav, PillarCard, Screen } from "@/ui";
import { HERO_NAV_STACK_WIDTH } from "@/ui/heroNav";
import { colors, layout, spacing, typography } from "@/ui/theme";

const HERO_MIN_HEIGHT = 520;
const PARALLAX_EXTRA = 120;

const PILLARS = [
  {
    title: "Community first",
    body: "Homes and rooms chosen for neighbors who value connection, shared values, and places you can return to year after year.",
  },
  {
    title: "Safe by design",
    body: "Owner-listed spaces with clear expectations, respectful screening, and direct communication—so families know who they are welcoming home.",
  },
  {
    title: "Owner-listed trust",
    body: "No MLS noise. Real owners, real addresses, and transparent listings across U.S. cities.",
  },
] as const;

function brandScale(width: number, mobileBesideNav: boolean) {
  if (mobileBesideNav) {
    // Fill remaining width beside the right menu; size up for readability.
    if (width < 360) {
      return { fontSize: 15, letterSpacing: 1.2 };
    }
    if (width < 420) {
      return { fontSize: 17, letterSpacing: 1.6 };
    }
    return { fontSize: 20, letterSpacing: 2 };
  }
  if (width < 340) {
    return { fontSize: 11, letterSpacing: 1.5 };
  }
  if (width < 390) {
    return { fontSize: 12, letterSpacing: 2 };
  }
  if (width < 768) {
    return { fontSize: 14, letterSpacing: 2.5 };
  }
  return { fontSize: 18, letterSpacing: 4 };
}

export default function EntryScreen() {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isNativeMobile = Platform.OS === "ios" || Platform.OS === "android";
  const compactTopBar = isNativeMobile || windowWidth < 768;
  /** Mobile: brand sits left of nav and stretches to the menu stack height. */
  const mobileBrandBesideNav = isNativeMobile;
  const brandMetrics = brandScale(windowWidth, mobileBrandBesideNav);
  const heroHeight = Math.max(HERO_MIN_HEIGHT, Math.round(windowHeight * 0.82));
  const scrollY = useRef(new Animated.Value(0)).current;

  const imageTranslate = scrollY.interpolate({
    inputRange: [-100, 0, heroHeight],
    outputRange: [40, 0, -heroHeight * 0.35],
    extrapolate: "clamp",
  });

  const overlayOpacity = scrollY.interpolate({
    inputRange: [0, heroHeight * 0.6],
    outputRange: [0.32, 0.65],
    extrapolate: "clamp",
  });

  return (
    <Screen testID="entry" style={styles.screen}>
      <Animated.ScrollView
        testID="entry-scroll"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.hero, { height: heroHeight }]}>
          <Animated.Image
            accessibilityIgnoresInvertColors
            source={{ uri: MARKETING_HERO_IMAGE }}
            style={[
              styles.heroImage,
              {
                height: heroHeight + PARALLAX_EXTRA,
                transform: [{ translateY: imageTranslate }],
              },
            ]}
            resizeMode="cover"
          />
          <Animated.View
            style={[styles.heroOverlay, { opacity: overlayOpacity }]}
          />
          <View
            style={[
              styles.topBar,
              mobileBrandBesideNav && styles.topBarMobile,
              { paddingTop: insets.top + spacing.sm },
            ]}
          >
            {mobileBrandBesideNav ? (
              <GlassText
                variant="brand"
                testID="entry-brand"
                compact
                fillHeight
                brandFontSize={brandMetrics.fontSize}
                brandLetterSpacing={brandMetrics.letterSpacing}
                style={styles.brandBesideNav}
              >
                UMMAH HOMES
              </GlassText>
            ) : (
              <View style={styles.brandOverlay} pointerEvents="box-none">
                <GlassText
                  variant="brand"
                  testID="entry-brand"
                  compact={compactTopBar}
                  brandFontSize={brandMetrics.fontSize}
                  brandLetterSpacing={brandMetrics.letterSpacing}
                  style={[
                    styles.brandBadge,
                    {
                      maxWidth:
                        windowWidth -
                        spacing.md * 2 -
                        HERO_NAV_STACK_WIDTH -
                        spacing.sm,
                    },
                  ]}
                >
                  UMMAH HOMES
                </GlassText>
              </View>
            )}
            <HeroDiscoverNav />
          </View>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>A place to belong</Text>
            <Text style={styles.heroSubtitle}>
              Owner-listed homes, rooms, and basements in welcoming U.S.
              communities—built around safety, dignity, and neighborly living.
            </Text>
          </View>
        </View>

        <View style={styles.aerialBand}>
          <Image
            accessibilityIgnoresInvertColors
            accessibilityLabel="Aerial view of a suburban neighborhood"
            source={{ uri: MARKETING_DRONE_NEIGHBORHOOD }}
            style={styles.aerialImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.introBand}>
          <Container>
            <Text style={styles.introKicker}>Community living</Text>
            <Text style={styles.introTitle}>
              A calm place to live — and return to
            </Text>
            <Text style={styles.introBody}>
              Inspired by boutique residence marketing, ummahHomes foregrounds
              warmth, privacy, and intentional community—not anonymous listings.
            </Text>
          </Container>
        </View>

        <Container>
          <Text style={styles.sectionLabel}>Three reasons to choose us</Text>
          <View style={styles.pillarGrid}>
            {PILLARS.map((pillar) => (
              <PillarCard
                key={pillar.title}
                title={pillar.title}
                body={pillar.body}
                testID={`entry-pillar-${pillar.title.toLowerCase().replace(/\s+/g, "-")}`}
              />
            ))}
          </View>
        </Container>

        <View style={styles.featureSection}>
          <Image
            accessibilityIgnoresInvertColors
            source={{ uri: MARKETING_COMMUNITY_IMAGE }}
            style={styles.featureImage}
            resizeMode="cover"
          />
          <Container style={styles.featureCopy}>
            <Text style={styles.featureTitle}>Designed as a community</Text>
            <Text style={styles.featureBody}>
              Walkable streets, shared values, and homes that feel personal—not
              like a faceless portal. Browse listings with real photos, real
              cities, and amenities that matter to daily life.
            </Text>
          </Container>
        </View>

        <View style={styles.featureSectionAlt}>
          <Image
            accessibilityIgnoresInvertColors
            accessibilityLabel="Bright, welcoming living room in a family home"
            source={{ uri: MARKETING_SAFE_HOME_IMAGE }}
            style={styles.featureImageLarge}
            resizeMode="cover"
          />
          <Container style={styles.featureCopy}>
            <Text style={styles.featureTitle}>Safe environment to live</Text>
            <Text style={styles.featureBody}>
              Background-check stubs, owner verification, and direct messaging
              keep seekers and sellers aligned before anyone moves in.
            </Text>
          </Container>
        </View>

        <View style={styles.ctaBand}>
          <Container>
            <Text style={styles.ctaTitle}>Ready to explore?</Text>
            <Text style={styles.ctaBody}>
              Search owner-listed homes across real U.S. cities—with photos and
              amenities on every card.
            </Text>
            <View style={styles.ctaAction}>
              <GlassNavLink
                href="/browse"
                label="View Homes"
                testID="entry-cta-browse"
              />
            </View>
          </Container>
        </View>

        <Text style={styles.footer}>
          Owner-listed only · No MLS · Direct connection
        </Text>
      </Animated.ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
  hero: {
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.brownDeep,
  },
  topBar: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingHorizontal: spacing.md,
  },
  topBarMobile: {
    justifyContent: "flex-start",
    alignItems: "stretch",
    gap: spacing.sm,
  },
  brandOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: spacing.md + HERO_NAV_STACK_WIDTH,
  },
  brandBadge: {
    maxWidth: "100%",
  },
  brandBesideNav: {
    marginRight: 0,
  },
  heroCopy: {
    zIndex: 2,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    maxWidth: layout.maxContentWidth,
    width: "100%",
    alignSelf: "center",
    gap: spacing.md,
  },
  heroTitle: {
    color: colors.white,
    fontFamily: typography.familyDisplay,
    fontSize: 44,
    fontWeight: "700",
    lineHeight: 50,
  },
  heroSubtitle: {
    color: colors.white,
    fontSize: typography.sizeBody,
    lineHeight: 24,
    maxWidth: 560,
    opacity: 0.92,
  },
  aerialBand: {
    width: "100%",
    backgroundColor: colors.greenSoft,
  },
  aerialImage: {
    width: "100%",
    height: 420,
  },
  introBand: {
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
  },
  introKicker: {
    color: colors.primary,
    fontSize: typography.sizeSmall,
    fontWeight: typography.weightMedium,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  introTitle: {
    fontFamily: typography.familyDisplay,
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  introBody: {
    color: colors.brownMid,
    fontSize: typography.sizeBody,
    lineHeight: 24,
    maxWidth: 640,
  },
  sectionLabel: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    fontSize: typography.sizeSmall,
    fontWeight: typography.weightMedium,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.brownMid,
  },
  pillarGrid: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  featureSection: {
    marginBottom: spacing.lg,
  },
  featureSectionAlt: {
    marginBottom: spacing.xl,
  },
  featureImage: {
    width: "100%",
    height: 280,
    backgroundColor: colors.greenSoft,
  },
  featureImageLarge: {
    width: "100%",
    height: 360,
    backgroundColor: colors.greenSoft,
  },
  featureCopy: {
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  featureTitle: {
    fontFamily: typography.familyDisplay,
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  featureBody: {
    color: colors.brownMid,
    fontSize: typography.sizeBody,
    lineHeight: 24,
    maxWidth: 640,
  },
  ctaBand: {
    backgroundColor: colors.brownDeep,
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  ctaTitle: {
    fontFamily: typography.familyDisplay,
    fontSize: 30,
    fontWeight: "700",
    color: colors.white,
    marginBottom: spacing.sm,
  },
  ctaBody: {
    color: colors.blue,
    fontSize: typography.sizeBody,
    lineHeight: 24,
    marginBottom: spacing.lg,
    maxWidth: 520,
  },
  ctaAction: {
    alignItems: "center",
  },
  footer: {
    textAlign: "center",
    color: colors.brownMid,
    paddingBottom: spacing.xl,
    fontSize: typography.sizeSmall,
  },
});
