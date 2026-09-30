import type { HighlightCodeFn } from "@rangex/editor";
import { createHighlighterCoreSync } from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import { tokenizeCode } from "../_Utilities";
import type { CreateHTMLViewHighlighterParams } from "./CreateHTMLViewHighlighter-types";

/*
 * Builds a synchronous `highlightCode` function for `createHTMLView`, running Shiki on the calling thread without a
 * worker, so it can be used on the server. `langs`/`themes` must be already imported registrations, not lazy
 * loaders. Each `@shikijs/langs/*` module exports an array (the language plus the languages it embeds), so `langs`
 * takes one entry per module (e.g. `langs: [typescript, css, html]`).
 *
 * If the requested language/theme wasn't among the loaded `langs`/`themes`, Shiki throws — that's caught here and
 * answered with `null`, which leaves the code block unhighlighted.
 */
export const createHTMLViewHighlighter = ({
	langs,
	themes,
}: CreateHTMLViewHighlighterParams): HighlightCodeFn => {
	const highlighter = createHighlighterCoreSync({
		langs,
		themes,
		engine: createJavaScriptRegexEngine(),
	});

	return ({ lines, language, theme }) => {
		try {
			return tokenizeCode({ highlighter, lines, language, theme });
		} catch (error) {
			console.warn(
				`[syntax-highlighter-shiki] Failed to highlight language "${language}" with theme "${theme.light}"/"${theme.dark}".`,
				error,
			);
			return null;
		}
	};
};
