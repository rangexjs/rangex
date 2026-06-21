import {
	contentLineName,
	contentLineRoleSelector,
	listName,
	listRoleSelector,
} from "rich-text-area";
import { toHighlighterLang } from "../_Utilities";
import { ensureNodeCodeBlockStorage } from "../CodeBlockStorage";
import type { HandleCodeBlockPopoverStateParams } from "./HandleCodeBlockPopoverState-types";

/**
 * Wires the popover's language/theme/copy actions to the engine.
 * Reads the active code block from `internals` — set by `handleCodeBlockPopoverAppearance`
 * whenever the popover opens over a new block.
 */
export const handleCodeBlockPopoverState = ({
	richTextEditorUI,
	editorAPI,
	codeHighlighter,
	internals,
}: HandleCodeBlockPopoverStateParams) => {
	const { codeBlockPopover } = richTextEditorUI;

	codeBlockPopover.onLanguageChange((language) => {
		if (!internals.currentCodeBlock) {
			return;
		}
		const storage = ensureNodeCodeBlockStorage({
			blockNestedContext: internals.currentCodeBlock,
		});
		codeHighlighter.update({
			blockNestedContext: internals.currentCodeBlock,
			lang: toHighlighterLang(language),
			theme: storage.theme,
		});
		codeBlockPopover.updateState({ language });
	});

	codeBlockPopover.onLightThemeChange((lightTheme) => {
		if (!internals.currentCodeBlock) {
			return;
		}
		const storage = ensureNodeCodeBlockStorage({
			blockNestedContext: internals.currentCodeBlock,
		});
		codeHighlighter.update({
			blockNestedContext: internals.currentCodeBlock,
			lang: storage.lang,
			theme: { ...storage.theme, light: lightTheme },
		});
		codeBlockPopover.updateState({ lightTheme });
	});

	codeBlockPopover.onDarkThemeChange((darkTheme) => {
		if (!internals.currentCodeBlock) {
			return;
		}
		const storage = ensureNodeCodeBlockStorage({
			blockNestedContext: internals.currentCodeBlock,
		});
		codeHighlighter.update({
			blockNestedContext: internals.currentCodeBlock,
			lang: storage.lang,
			theme: { ...storage.theme, dark: darkTheme },
		});
		codeBlockPopover.updateState({ darkTheme });
	});

	codeBlockPopover.onCopy(() => {
		if (!internals.currentCodeBlock) {
			return;
		}

		const list = internals.currentCodeBlock.$$querySelector(listRoleSelector);

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
};
