import type { JSX } from "@solidjs/web";
import type { Accessor } from "solid-js";

export type ThemeValue = "light" | "dark" | "system";

export interface EditorContainerProps {
  theme: Accessor<ThemeValue>;
  onThemeChange: (theme: ThemeValue) => void;
  children: JSX.Element;
}
