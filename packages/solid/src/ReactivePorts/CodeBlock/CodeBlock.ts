import type { CodeBlockPublicPort } from "@rangex/editor";
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
	const [isActive, setIsActive] = createSignal(publicPort.isActive);
	const [language, setLanguage] = createSignal(publicPort.language);
	const [lightTheme, setLightTheme] = createSignal(publicPort.lightTheme);
	const [darkTheme, setDarkTheme] = createSignal(publicPort.darkTheme);
	const [currentComponent, setCurrentComponent] = createSignal(
		publicPort.currentComponent,
	);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));
	onCleanup(publicPort.onIsActiveUpdate(setIsActive));
	onCleanup(publicPort.onLanguageUpdate(setLanguage));
	onCleanup(publicPort.onLightThemeUpdate(setLightTheme));
	onCleanup(publicPort.onDarkThemeUpdate(setDarkTheme));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentComponent));

	const port: ReactiveCodeBlockPort = {
		canInsert,
		canWrap,
		isActive,
		language,
		lightTheme,
		darkTheme,
		currentComponent,
	};

	return port as PreserveUndefined<T, ReactiveCodeBlockPort>;
};
