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
import type { HandleCodeBlockOverlayStateParams } from "./HandleCodeBlockOverlayState-types";

/*
 * Wires the code block overlay's language/theme changes and plain-text export to the engine,
 * applying them to the currently active code block and re-highlighting it. Returns a cleanup function.
 */
export const handleCodeBlockOverlayState = ({
	configPort,
	editorAPI,
	getCurrentBlock,
	codeHighlighter,
}: HandleCodeBlockOverlayStateParams) => {
	const unsubscribeLanguageChange = configPort.onChangeLanguage((language) => {
		const currentCodeBlock = getCurrentBlock();
		if (!currentCodeBlock) {
			return;
		}

		const storage = ensureNodeCodeBlockStorage({
			blockComponent: currentCodeBlock,
			fallbacks: codeBlockStorageFallbacks,
		});

		codeHighlighter.update({
			blockComponent: currentCodeBlock,
			language,
			theme: storage.theme,
		});
		configPort.updateState({ language, theme: storage.theme });
	});

	const unsubscribeThemeChange = configPort.onChangeTheme((theme) => {
		const currentCodeBlock = getCurrentBlock();
		if (!currentCodeBlock) {
			return;
		}

		const storage = ensureNodeCodeBlockStorage({
			blockComponent: currentCodeBlock,
			fallbacks: codeBlockStorageFallbacks,
		});
		codeHighlighter.update({
			blockComponent: currentCodeBlock,
			language: storage.language,
			theme,
		});
		configPort.updateState({ theme });
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
		unsubscribeThemeChange();
	};
};
