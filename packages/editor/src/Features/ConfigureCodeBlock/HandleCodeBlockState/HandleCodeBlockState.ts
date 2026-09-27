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
import type { HandleCodeBlockStateParams } from "./HandleCodeBlockState-types";

/*
 * Keeps the port's language/theme in sync with the current code block and wires language/theme
 * changes and plain-text export to it, re-highlighting on change. Returns a cleanup function.
 */
export const handleCodeBlockState = ({
	configPort,
	editorAPI,
	codeHighlighter,
}: HandleCodeBlockStateParams) => {
	const unsubscribeCurrentComponentUpdate = configPort.onCurrentComponentUpdate(
		(currentComponent) => {
			if (!currentComponent) {
				return;
			}

			const storage = ensureNodeCodeBlockStorage({
				blockComponent: currentComponent,
				fallbacks: codeBlockStorageFallbacks,
			});

			configPort.updateState({
				language: storage.language,
				theme: storage.theme,
			});
		},
	);

	const unsubscribeLanguageChange = configPort.onChangeLanguage((language) => {
		const currentCodeBlock = configPort.currentComponent;
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
		const currentCodeBlock = configPort.currentComponent;
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
		const currentCodeBlock = configPort.currentComponent;

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
		unsubscribeCurrentComponentUpdate();
		unsubscribeLanguageChange();
		unsubscribeThemeChange();
	};
};
