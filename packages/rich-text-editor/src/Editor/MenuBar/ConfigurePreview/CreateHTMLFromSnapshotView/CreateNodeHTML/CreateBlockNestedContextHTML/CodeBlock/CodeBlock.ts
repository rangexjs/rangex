import { contentLineRoleSelector } from "rich-text-area";
import { syntaxHighlighter } from "#libs";
import {
	codeBlockStorageFallbacks,
	ensureCodeBlockStorage,
} from "../../../../../../Storage";
import type {
	ApplyTokenSpansParams,
	HighlightCodeBlockParams,
	HighlightCodeBlockResult,
} from "./CodeBlock-types";

export const applyTokenSpans = ({
	codeBlockEl,
	contentLineEls,
	backgrounds,
	codeLines,
	theme,
}: ApplyTokenSpansParams): void => {
	const { light, dark } = theme;

	codeBlockEl.style.background = `light-dark(${backgrounds[light]}, ${backgrounds[dark]})`;

	for (let i = 0; i < codeLines.length; i++) {
		const tokenLine = codeLines[i];
		const contentLineEl = contentLineEls[i];

		if (!contentLineEl || tokenLine.length === 0) {
			continue;
		}

		contentLineEl.normalize();

		const textNode = contentLineEl.firstChild;

		if (!(textNode instanceof Text)) {
			continue;
		}

		let remaining = textNode;

		for (let t = 0; t < tokenLine.length; t++) {
			const { content, colors } = tokenLine[t];
			const isLastToken = t === tokenLine.length - 1;

			/** splitText truncates `remaining` to the token's chars and returns the rest. */
			let tokenNode: Text;
			if (isLastToken) {
				tokenNode = remaining;
			} else {
				const after = remaining.splitText(content.length);
				tokenNode = remaining;
				remaining = after;
			}

			const lightColor = colors[light];
			const darkColor = colors[dark];

			if (!(lightColor.startsWith("#") && darkColor.startsWith("#"))) {
				continue;
			}

			const span = document.createElement("span");
			span.style.color = `light-dark(${lightColor}, ${darkColor})`;
			tokenNode.parentElement?.insertBefore(span, tokenNode);
			span.append(tokenNode);
		}
	}
};

export const highlightCodeBlock = async ({
	codeBlockEl,
	customStorage,
}: HighlightCodeBlockParams): HighlightCodeBlockResult => {
	const { lang, theme } = ensureCodeBlockStorage({
		storage: customStorage,
		fallbacks: codeBlockStorageFallbacks,
	});

	const contentLineEls = Array.from(
		codeBlockEl.querySelectorAll(contentLineRoleSelector),
	);

	const lines = contentLineEls.map((el) => el.textContent);

	const { backgrounds, codeLines } = await syntaxHighlighter.getHighlightInfo({
		lines,
		lang,
	});

	applyTokenSpans({
		codeBlockEl,
		contentLineEls,
		backgrounds,
		codeLines,
		theme,
	});
};
