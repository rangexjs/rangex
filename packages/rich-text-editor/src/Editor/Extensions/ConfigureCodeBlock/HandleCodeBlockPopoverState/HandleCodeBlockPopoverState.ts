import {
	contentLineName,
	contentLineRoleSelector,
	listName,
	listRoleSelector,
} from "rich-text-area";
import { toHighlighterLang, toHighlighterTheme } from "../../../Libs";
import {
	codeBlockStorageFallbacks,
	ensureNodeCodeBlockStorage,
} from "../../../Storage";
import type { HandleCodeBlockPopoverStateParams } from "./HandleCodeBlockPopoverState-types";

/**
 * Wires the popover's language/theme/copy actions to the engine.
 * Reads the active code block from the shared {@link OverlayAppearanceHandler} —
 * set whenever the popover opens over a new block.
 */
export const handleCodeBlockPopoverState = ({
	editorPort,
	editorAPI,
	getCurrentBlock,
	codeHighlighter,
}: HandleCodeBlockPopoverStateParams) => {
	const unsubscribeLanguageChange = editorPort.onLanguageChange((language) => {
		const currentCodeBlock = getCurrentBlock();
		if (!currentCodeBlock) {
			return;
		}
		const lang = toHighlighterLang(language);
		if (!lang) {
			return;
		}
		const storage = ensureNodeCodeBlockStorage({
			blockNestedContext: currentCodeBlock,
			fallbacks: codeBlockStorageFallbacks,
		});
		codeHighlighter.update({
			blockNestedContext: currentCodeBlock,
			lang,
			theme: storage.theme,
		});
		editorPort.updateState({ language });
	});

	const unsubscribeLightThemeChange = editorPort.onLightThemeChange(
		(lightTheme) => {
			const currentCodeBlock = getCurrentBlock();
			if (!currentCodeBlock) {
				return;
			}
			const highlighterLightTheme = toHighlighterTheme(lightTheme);
			if (!highlighterLightTheme) {
				return;
			}
			const storage = ensureNodeCodeBlockStorage({
				blockNestedContext: currentCodeBlock,
				fallbacks: codeBlockStorageFallbacks,
			});
			codeHighlighter.update({
				blockNestedContext: currentCodeBlock,
				lang: storage.lang,
				theme: { ...storage.theme, light: highlighterLightTheme },
			});
			editorPort.updateState({ lightTheme });
		},
	);

	const unsubscribeDarkThemeChange = editorPort.onDarkThemeChange(
		(darkTheme) => {
			const currentCodeBlock = getCurrentBlock();
			if (!currentCodeBlock) {
				return;
			}
			const highlighterDarkTheme = toHighlighterTheme(darkTheme);
			if (!highlighterDarkTheme) {
				return;
			}
			const storage = ensureNodeCodeBlockStorage({
				blockNestedContext: currentCodeBlock,
				fallbacks: codeBlockStorageFallbacks,
			});
			codeHighlighter.update({
				blockNestedContext: currentCodeBlock,
				lang: storage.lang,
				theme: { ...storage.theme, dark: highlighterDarkTheme },
			});
			editorPort.updateState({ darkTheme });
		},
	);

	const unsubscribeCopy = editorPort.onCopy(() => {
		const currentCodeBlock = getCurrentBlock();
		if (!currentCodeBlock) {
			return;
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
					toOffset: contentLine.childNodes.length,
				}),
			);
		}

		navigator.clipboard.writeText(lines.join("\n"));
	});

	return () => {
		unsubscribeLanguageChange();
		unsubscribeLightThemeChange();
		unsubscribeDarkThemeChange();
		unsubscribeCopy();
	};
};
