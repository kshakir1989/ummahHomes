export const colors = {
  primary: "#1B6B4A",
  primaryDeep: "#145A3A",
  background: "#F5F0E8",
  surface: "#FFFBF5",
  white: "#FFFFFF",
  brownDeep: "#3E2723",
  brownMid: "#6D4C41",
  brownWarm: "#8D6E63",
  greenSoft: "#E8F3ED",
  text: "#1A1A1E",
  textMuted: "#6B7280",
  danger: "#B3261E",
} as const;

export const typography = {
  family: "Inter, system-ui, -apple-system, sans-serif",
  sizeBody: 16,
  sizeHeading: 20,
  sizeSmall: 14,
  weightRegular: "400" as const,
  weightMedium: "500" as const,
  weightBold: "700" as const,
};

export const spacing = {
  unit: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  card: 12,
  button: 8,
  chip: 999,
} as const;

export const layout = {
  maxContentWidth: 1280,
  heroStripHeight: 200,
  mobileHeroHeight: "40vh" as const,
};

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  layout,
};

export type Theme = typeof theme;
