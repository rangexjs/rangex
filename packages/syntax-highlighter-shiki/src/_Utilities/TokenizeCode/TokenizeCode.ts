import type { CodeBlockTheme, ThemedCodeLine, ThemedCodeLines } from "@rangex/editor/code-block";

import type { TokenizeCodeParams, TokenizeCodeResult } from "./TokenizeCode-types";

/*
 * Tokenizes the code lines with both themes of a loaded highlighter. Throws when the language or a theme isn't loaded.
 */
export const tokenizeCode = ({
	highlighter,
	lines,
	language,
	theme,
}: TokenizeCodeParams): TokenizeCodeResult => {
	const code = lines.join("\n");

	const tokens = highlighter.codeToTokensWithThemes(code, {
		lang: language,
		themes: { light: theme.light, dark: theme.dark },
	});

	const { bg: bgLight, fg: fgLight } = highlighter.getTheme(theme.light);
	const { bg: bgDark, fg: fgDark } = highlighter.getTheme(theme.dark);

	const backgrounds: CodeBlockTheme = { light: bgLight, dark: bgDark };
	const foregrounds: CodeBlockTheme = { light: fgLight, dark: fgDark };

	const codeLines: ThemedCodeLines = [];

	for (const tokenLine of tokens) {
		const codeLine: ThemedCodeLine = [];
		codeLines.push(codeLine);

		for (const themedToken of tokenLine) {
			const { content, variants } = themedToken;

			codeLine.push({
				colors: {
					light: variants.light.color ?? "",
					dark: variants.dark.color ?? "",
				},
				content,
			});
		}
	}

	return { backgrounds, foregrounds, codeLines };
};
