import { MenuBar } from "../MenuBar";
import type { EditorContainerProps, ThemeValue } from "./EditorContainer-types";

const colorSchemeMap: Record<ThemeValue, string> = {
	light: "light",
	dark: "dark",
	system: "light dark",
};

export const EditorContainer = (props: EditorContainerProps) => {
	const colorScheme = () => colorSchemeMap[props.theme()];

	return (
		<div
			class="overflow-clip rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
			data-color-scheme={props.theme()}
			style={{ "color-scheme": colorScheme() }}
		>
			<MenuBar theme={props.theme} onThemeChange={props.onThemeChange} />
			{props.children}
		</div>
	);
};
