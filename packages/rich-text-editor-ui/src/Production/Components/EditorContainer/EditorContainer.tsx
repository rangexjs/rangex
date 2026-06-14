import { createSignal, type JSX, onCleanup, onMount } from "solid-js";
import { menuBarButtonsName } from "../../Constants";
import type { MenuBarButtonsStateManager } from "../../MenuBarButtonsStateManager";

interface EditorContainerProps {
	menuBarButtonsStateManager: MenuBarButtonsStateManager;
	children: JSX.Element;
}

export const EditorContainer = (props: EditorContainerProps) => {
	const [theme, setTheme] = createSignal(
		props.menuBarButtonsStateManager.theme,
	);

	onMount(() => {
		props.menuBarButtonsStateManager.subscribe({
			type: menuBarButtonsName.theme,
			callback: setTheme,
		});
	});

	onCleanup(() => {
		props.menuBarButtonsStateManager.unsubscribe({
			type: menuBarButtonsName.theme,
			callback: setTheme,
		});
	});

	const colorSchemeMap = {
		light: "light",
		dark: "dark",
		system: "light dark",
		inherit: undefined,
	} as const;

	const colorScheme = () => colorSchemeMap[theme().value];

	return (
		<div
			class="overflow-clip rounded-xl border border-neutral-200 bg-white dark:bg-neutral-950"
			data-color-scheme={theme().value}
			style={{ "color-scheme": colorScheme() }}
		>
			{props.children}
		</div>
	);
};
