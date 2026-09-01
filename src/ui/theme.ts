/**
 * Design tokens. Active preset: `EXPO_PUBLIC_THEME` (`emarat` | `stage1`), default `emarat`.
 * Emarat-inspired: cool luxury palette (navy ink, blue-gray accents) — exploration theme.
 */

export type ColorTokens = {
  primary: string;
  primaryDeep: string;
  background: string;
  surface: string;
  white: string;
  brownDeep: string;
  brownMid: string;
  brownWarm: string;
  greenSoft: string;
  blue: string;
  text: string;
  textMuted: string;
  danger: string;
};

export type TypographyTokens = {
  family: string;
  familyDisplay: string;
  sizeBody: number;
  sizeHeading: number;
  sizeSmall: number;
  weightRegular: "400";
  weightMedium: "500";
  weightBold: "700";
};

const stage1Colors: ColorTokens = {
  primary: "#1B6B4A",
  primaryDeep: "#145A3A",
  background: "#F5F0E8",
  surface: "#FFFBF5",
  white: "#FFFFFF",
  brownDeep: "#3E2723",
  brownMid: "#6D4C41",
  brownWarm: "#8D6E63",
  greenSoft: "#E8F3ED",
  blue: "#B5CEDB",
  text: "#1A1A1E",
  textMuted: "#6B7280",
  danger: "#B3261E",
};

const emaratColors: ColorTokens = {
  primary: "#1A2B4A",
  primaryDeep: "#0F1A2E",
  background: "#F7F8FA",
  surface: "#FFFFFF",
  white: "#FFFFFF",
  brownDeep: "#141820",
  brownMid: "#5C6670",
  brownWarm: "#D4DCE4",
  greenSoft: "#E8EEF3",
  blue: "#B5CEDB",
  text: "#141820",
  textMuted: "#6B7280",
  danger: "#B3261E",
};

const stage1Typography: TypographyTokens = {
  family: "Inter, system-ui, -apple-system, sans-serif",
  familyDisplay: "Inter, system-ui, -apple-system, sans-serif",
  sizeBody: 16,
  sizeHeading: 20,
  sizeSmall: 14,
  weightRegular: "400",
  weightMedium: "500",
  weightBold: "700",
};

const emaratTypography: TypographyTokens = {
  family: "Inter, system-ui, -apple-system, sans-serif",
  familyDisplay: "Georgia, 'Times New Roman', serif",
  sizeBody: 16,
  sizeHeading: 20,
  sizeSmall: 14,
  weightRegular: "400",
  weightMedium: "500",
  weightBold: "700",
};

const presets = {
  stage1: {
    colors: stage1Colors,
    typography: stage1Typography,
    radius: { card: 12, button: 8, chip: 999 },
  },
  emarat: {
    colors: emaratColors,
    typography: emaratTypography,
    radius: { card: 10, button: 6, chip: 999 },
  },
} as const;

export type ThemePresetId = keyof typeof presets;

const activePresetId: ThemePresetId =
  process.env.EXPO_PUBLIC_THEME === "stage1" ? "stage1" : "emarat";

const active = presets[activePresetId];

export const themePresetId = activePresetId;

export const colors = active.colors;

export const typography = active.typography;

export const spacing = {
  unit: 8,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = active.radius;

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
  presetId: activePresetId,
};

export type Theme = typeof theme;
