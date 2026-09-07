import {
	contentLineName,
	contentLineRoleSelector,
	listName,
	listRoleSelector,
} from "rich-text-area";
import {
	codeBlockStorageFallbacks,
	ensureNodeCodeBlockStorage,
} from "#engine-links";
import { toHighlighterLang, toHighlighterTheme } from "#libs";
import type { HandleCodeBlockOverlayStateParams } from "./HandleCodeBlockOverlayState-types";

/**
 * Wires the overlay's language/theme/copy actions to the engine.
 * Reads the active code block from the shared {@link OverlayAppearanceHandler} —
 * set whenever the overlay opens over a new block.
 */
export const handleCodeBlockOverlayState = ({
	configPort,
	editorAPI,
	getCurrentBlock,
	codeHighlighter,
}: HandleCodeBlockOverlayStateParams) => {
	const unsubscribeLanguageChange = configPort.onLanguage((language) => {
		const currentCodeBlock = getCurrentBlock();
		if (!currentCodeBlock) {
			return;
		}
		const lang = toHighlighterLang(language);
		if (!lang) {
			return;
		}
		const storage = ensureNodeCodeBlockStorage({
			blockComponent: currentCodeBlock,
			fallbacks: codeBlockStorageFallbacks,
		});
		codeHighlighter.update({
			blockComponent: currentCodeBlock,
			lang,
			theme: storage.theme,
		});
		configPort.updateState({ language });
	});

	const unsubscribeLightThemeChange = configPort.onLightTheme((lightTheme) => {
		const currentCodeBlock = getCurrentBlock();
		if (!currentCodeBlock) {
			return;
		}
		const highlighterLightTheme = toHighlighterTheme(lightTheme);
		if (!highlighterLightTheme) {
			return;
		}
		const storage = ensureNodeCodeBlockStorage({
			blockComponent: currentCodeBlock,
			fallbacks: codeBlockStorageFallbacks,
		});
		codeHighlighter.update({
			blockComponent: currentCodeBlock,
			lang: storage.lang,
			theme: { ...storage.theme, light: highlighterLightTheme },
		});
		configPort.updateState({ lightTheme });
	});

	const unsubscribeDarkThemeChange = configPort.onDarkTheme((darkTheme) => {
		const currentCodeBlock = getCurrentBlock();
		if (!currentCodeBlock) {
			return;
		}
		const highlighterDarkTheme = toHighlighterTheme(darkTheme);
		if (!highlighterDarkTheme) {
			return;
		}
		const storage = ensureNodeCodeBlockStorage({
			blockComponent: currentCodeBlock,
			fallbacks: codeBlockStorageFallbacks,
		});
		codeHighlighter.update({
			blockComponent: currentCodeBlock,
			lang: storage.lang,
			theme: { ...storage.theme, dark: highlighterDarkTheme },
		});
		configPort.updateState({ darkTheme });
	});

	configPort.registerPlainTextProvider(() => {
		const currentCodeBlock = getCurrentBlock();

		if (!currentCodeBlock) {
			return [];
		}

		const list = currentCodeBlock.$$querySelector(listRoleSelector);

		if (list?.$$editorRole !== listName) {
			throw new Error("List's type is invalid.");
		}

		const lines: string[] = [];

		for (const listItem of list.$$children) {
			const contentLine = listItem.$$querySelector(contentLineRoleSelector);

			if (contentLine?.$$editorRole !== contentLineName) {
				throw new Error("ContentLine's type is invalid.");
			}

			lines.push(
				editorAPI.getPlainText({
					fromNode: contentLine,
					fromOffset: 0,
					toNode: contentLine,
					toOffset: contentLine.$$childNodes.length,
				}),
			);
		}

		return lines;
	});

	return () => {
		unsubscribeLanguageChange();
		unsubscribeLightThemeChange();
		unsubscribeDarkThemeChange();
	};
};
