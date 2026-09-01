import { useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "./theme";

export interface PillarCardProps {
  title: string;
  body: string;
  testID?: string;
}

export function PillarCard({ title, body, testID }: PillarCardProps) {
  const hoverAnim = useRef(new Animated.Value(0)).current;

  const animateTo = (value: number) => {
    Animated.spring(hoverAnim, {
      toValue: value,
      useNativeDriver: false,
      speed: 18,
      bounciness: 6,
    }).start();
  };

  const scale = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  const translateY = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const backgroundColor = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.white, colors.primary],
  });

  const borderColor = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.brownWarm, colors.primary],
  });

  const titleColor = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.text, colors.white],
  });

  const bodyColor = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.brownMid, colors.white],
  });

  const shadowOpacity = hoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.04, 0.2],
  });

  return (
    <Pressable
      onHoverIn={() => animateTo(1)}
      onHoverOut={() => animateTo(0)}
      onPressIn={() => animateTo(1)}
      onPressOut={() => animateTo(0)}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor,
            borderColor,
            shadowOpacity,
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        <Animated.Text style={[styles.title, { color: titleColor }]}>
          {title}
        </Animated.Text>
        <Animated.Text style={[styles.body, { color: bodyColor }]}>
          {body}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: colors.brownDeep,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
  },
  title: {
    fontFamily: typography.familyDisplay,
    fontSize: 22,
    fontWeight: "700",
  },
  body: {
    fontSize: typography.sizeBody,
    lineHeight: 22,
  },
});
