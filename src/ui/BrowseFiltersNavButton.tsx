import { GlassButton } from "./GlassButton";

export interface BrowseFiltersNavButtonProps {
  expanded: boolean;
  onPress: () => void;
}

export function BrowseFiltersNavButton({
  expanded,
  onPress,
}: BrowseFiltersNavButtonProps) {
  return (
    <GlassButton
      label={expanded ? "Hide filters" : "Filters"}
      compact
      active={expanded}
      testID="browse-filters-toggle"
      style={{ marginRight: 4 }}
      onPress={onPress}
    />
  );
}
