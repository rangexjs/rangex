import type { JSX } from "@solidjs/web";

export type ThemeValue = "light" | "dark" | "system";

export interface EditorContainerProps {
	children: JSX.Element;
}
