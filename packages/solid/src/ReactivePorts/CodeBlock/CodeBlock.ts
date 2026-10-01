import type { CodeBlockPublicPort } from "@rangex/editor/code-block";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveCodeBlockPort } from "./CodeBlock-types";

export const CodeBlock = <T extends CodeBlockPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveCodeBlockPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveCodeBlockPort>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [canWrap, setCanWrap] = createSignal(publicPort.canWrap);
	const [language, setLanguage] = createSignal(publicPort.language);
	const [theme, setTheme] = createSignal(publicPort.theme);
	const [currentComponent, setCurrentComponent] = createSignal(
		publicPort.currentComponent,
	);
	const [isSelectionActive, setIsSelectionActive] = createSignal(
		publicPort.isSelectionActive,
	);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));
	onCleanup(publicPort.onLanguageUpdate(setLanguage));
	onCleanup(publicPort.onThemeUpdate(setTheme));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentComponent));
	onCleanup(publicPort.onIsSelectionActiveUpdate(setIsSelectionActive));

	const port: ReactiveCodeBlockPort = {
		canInsert,
		canWrap,
		language,
		theme,
		currentComponent,
		isSelectionActive,
	};

	return port as PreserveUndefined<T, ReactiveCodeBlockPort>;
};
