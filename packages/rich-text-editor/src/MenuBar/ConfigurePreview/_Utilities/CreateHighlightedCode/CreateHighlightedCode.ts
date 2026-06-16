import { syntaxHighlighter } from "../../../../Libs";
import type {
	CreateHighlightedCodeParams,
	CreateHighlightedCodeResult,
} from "./CreateHighlightedCode-types";

/**
 * Delegates highlighting and markup generation to Shiki. `light-dark()`
 * makes every token's color follow the user's `data-color-scheme`, with no
 * extra stylesheet or class toggling needed — important since this is
 * rendered inside an isolated shadow root.
 */
export const createHighlightedCode = async ({
	code,
	lang,
	theme,
}: CreateHighlightedCodeParams): CreateHighlightedCodeResult => {
	const html = await syntaxHighlighter.getHighlightedHTML({
		code,
		lang,
		theme,
	});

	const template = document.createElement("template");
	template.innerHTML = html;

	const pre = template.content.firstElementChild;

	if (!(pre instanceof HTMLPreElement)) {
		throw new Error(
			`[createHighlightedCode] Expected Shiki to produce a <pre> element, got: ${pre?.constructor.name}`,
		);
	}

	pre.style.boxSizing = "border-box";
	pre.style.minWidth = "100%";
	pre.style.width = "max-content";
	pre.style.margin = "0";
	pre.style.padding = "8px";

	return pre;
};
