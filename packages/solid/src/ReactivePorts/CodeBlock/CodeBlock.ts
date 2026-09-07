import type { CodeBlockPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type {
	ReactiveCodeBlockPort,
	ReactiveCodeBlockResult,
} from "./CodeBlock-types";

export const CodeBlock = (
	publicPort: CodeBlockPublicPort,
): ReactiveCodeBlockResult => {
	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [canWrap, setCanWrap] = createSignal(publicPort.canWrap);
	const [isActive, setIsActive] = createSignal(publicPort.isActive);
	const [language, setLanguage] = createSignal(publicPort.language);
	const [lightTheme, setLightTheme] = createSignal(publicPort.lightTheme);
	const [darkTheme, setDarkTheme] = createSignal(publicPort.darkTheme);
	const [isOpen, setIsOpen] = createSignal(publicPort.isOpen);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onCanInsertUpdate(setCanInsert));
	unsubscribeList.add(publicPort.onCanWrapUpdate(setCanWrap));
	unsubscribeList.add(publicPort.onIsActiveUpdate(setIsActive));
	unsubscribeList.add(publicPort.onLanguageUpdate(setLanguage));
	unsubscribeList.add(publicPort.onLightThemeUpdate(setLightTheme));
	unsubscribeList.add(publicPort.onDarkThemeUpdate(setDarkTheme));
	unsubscribeList.add(publicPort.onIsOpenUpdate(setIsOpen));

	const port: ReactiveCodeBlockPort = {
		raw: publicPort,

		floatingEl: publicPort.floatingEl,
		languages: publicPort.languages,
		themes: publicPort.themes,

		canInsert,
		canWrap,
		isActive,
		language,
		lightTheme,
		darkTheme,
		isOpen,

		insert: publicPort.insert,
		wrap: publicPort.wrap,
		changeLanguage: publicPort.changeLanguage,
		changeLightTheme: publicPort.changeLightTheme,
		changeDarkTheme: publicPort.changeDarkTheme,
		remove: publicPort.remove,
		unwrap: publicPort.unwrap,
		getPlainText: publicPort.getPlainText,
	};

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
