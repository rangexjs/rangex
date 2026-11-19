import type { Accessor } from "solid-js";

import type { ToolbarButtonsLayout } from "#constants";
import type { ExtensionToolbarButtons } from "#extensions";

export type ThemeValue = "light" | "dark" | "system";

export interface EditorContainerProps {
  theme: Accessor<ThemeValue>;
  onThemeChange: (theme: ThemeValue) => void;
  toolbarButtonsLayout: ToolbarButtonsLayout;
  toolbarButtons: ExtensionToolbarButtons;
  editorContainer: HTMLDivElement;
}
