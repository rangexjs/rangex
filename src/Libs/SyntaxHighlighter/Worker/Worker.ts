import { createHighlighter } from "shiki";
import {
	highlighterLangs,
	highlighterThemes,
} from "../SyntaxHighlighter-constants";
import type {
	ThemeBackgrounds,
	ThemedCodeLine,
	ThemedCodeLines,
	TokenColors,
} from "../SyntaxHighlighter-types";
import type { WorkerRequest, WorkerResponse } from "./Worker-types";

const highlighterPromise = createHighlighter({
	langs: highlighterLangs,
	themes: highlighterThemes,
});

self.onmessage = async ({ data }: MessageEvent<WorkerRequest>) => {
	const { id, lines, lang } = data;

	const highlighter = await highlighterPromise;
	const code = lines.join("\n");

	const tokens = highlighter.codeToTokensWithThemes(code, {
		lang,
		themes: Object.fromEntries(highlighterThemes.map((t) => [t, t])),
	});

	const backgrounds = highlighterThemes.reduce<ThemeBackgrounds>(
		(variants, theme) => {
			const { bg } = highlighter.getTheme(theme);

			variants[theme] = bg;

			return variants;
		},
		{} as ThemeBackgrounds,
	);

	const codeLines: ThemedCodeLines = [];

	for (const tokenLine of tokens) {
		const codeLine: ThemedCodeLine = [];
		codeLines.push(codeLine);

		for (const themedToken of tokenLine) {
			const { content, variants } = themedToken;

			const colors: TokenColors = {} as TokenColors;

			for (const name in variants) {
				const typedName = name as keyof TokenColors;
				const value = variants[typedName];

				colors[typedName] = value.color ?? "";
			}

			codeLine.push({ colors, content });
		}
	}

	const response: WorkerResponse = { id, result: { backgrounds, codeLines } };

	self.postMessage(response);
};
