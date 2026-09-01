import { Platform, type ViewStyle } from "react-native";

const blurStyle: ViewStyle =
  Platform.OS === "web"
    ? ({
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      } as ViewStyle)
    : {};

export const glassPanelStyle: ViewStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.14)",
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.32)",
  ...blurStyle,
};

export const glassPanelOnLightStyle: ViewStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.72)",
  borderWidth: 1,
  borderColor: "rgba(26, 43, 74, 0.18)",
  ...blurStyle,
};

export const glassPanelActiveStyle: ViewStyle = {
  backgroundColor: "rgba(26, 43, 74, 0.78)",
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.36)",
  ...blurStyle,
};

export const glassPanelPrimaryStyle: ViewStyle = {
  backgroundColor: "rgba(26, 43, 74, 0.85)",
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.32)",
  ...blurStyle,
};

export const glassPanelSecondaryStyle: ViewStyle = {
  backgroundColor: "rgba(62, 39, 35, 0.82)",
  borderWidth: 1,
  borderColor: "rgba(255, 255, 255, 0.28)",
  ...blurStyle,
};

export type GlassTone = "onDark" | "onLight";

export function glassPanelForTone(
  tone: GlassTone,
  active = false,
): ViewStyle {
  if (active) {
    return glassPanelActiveStyle;
  }
  return tone === "onDark" ? glassPanelStyle : glassPanelOnLightStyle;
}
