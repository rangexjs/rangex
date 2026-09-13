import type { CodeBlockPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveCodeBlockPort } from "./CodeBlock-types";

export const CodeBlock = <T extends CodeBlockPublicPort | undefined>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [canWrap, setCanWrap] = createSignal(publicPort.canWrap);
	const [isActive, setIsActive] = createSignal(publicPort.isActive);
	const [language, setLanguage] = createSignal(publicPort.language);
	const [lightTheme, setLightTheme] = createSignal(publicPort.lightTheme);
	const [darkTheme, setDarkTheme] = createSignal(publicPort.darkTheme);
	const [currentBlock, setCurrentBlock] = createSignal(
		publicPort.currentComponent,
	);
	const [quickActionsOpen, setQuickActionsOpen] = createSignal(
		publicPort.quickActionsOpen,
	);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));
	onCleanup(publicPort.onIsActiveUpdate(setIsActive));
	onCleanup(publicPort.onLanguageUpdate(setLanguage));
	onCleanup(publicPort.onLightThemeUpdate(setLightTheme));
	onCleanup(publicPort.onDarkThemeUpdate(setDarkTheme));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentBlock));
	onCleanup(publicPort.onQuickActionsOpenUpdate(setQuickActionsOpen));

	const port: ReactiveCodeBlockPort = {
		quickActionsEl: publicPort.quickActionsEl,
		languages: publicPort.languages,
		themes: publicPort.themes,

		canInsert,
		canWrap,
		isActive,
		language,
		lightTheme,
		darkTheme,
		currentBlock,
		quickActionsOpen,

		insert: publicPort.insert,
		wrap: publicPort.wrap,
		changeLanguage: publicPort.changeLanguage,
		changeLightTheme: publicPort.changeLightTheme,
		changeDarkTheme: publicPort.changeDarkTheme,
		remove: publicPort.remove,
		unwrap: publicPort.unwrap,
		getPlainText: publicPort.getPlainText,
	};

	return port as FromPublicToReactivePort<T>;
};
