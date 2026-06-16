import { createHighlighter } from "shiki";
import { assertNever } from "../../../ErrorHandling";
import {
	highlighterLangs,
	highlighterThemes,
} from "../SyntaxHighlighter-constants";
import type {
	HighlightInfo,
	ThemeBackgrounds,
	ThemedCodeLine,
	ThemedCodeLines,
	TokenColors,
} from "../SyntaxHighlighter-types";
import type {
	HTMLRequest,
	TokensRequest,
	WorkerRequest,
	WorkerResponse,
} from "./Worker-types";

const highlighterPromise = createHighlighter({
	langs: highlighterLangs,
	themes: highlighterThemes,
});

const getTokens = async ({
	lines,
	lang,
}: TokensRequest): Promise<HighlightInfo> => {
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

	return { backgrounds, codeLines };
};

/**
 * Lets Shiki build the highlighted markup directly. `defaultColor:
 * "light-dark()"` makes every token's color (and the background) a
 * `light-dark(...)` value, so the result follows the user's
 * `data-color-scheme` without any extra stylesheet or class toggling.
 */
const getHTML = async ({ code, lang, theme }: HTMLRequest): Promise<string> => {
	const highlighter = await highlighterPromise;

	return highlighter.codeToHtml(code, {
		lang,
		themes: { light: theme.light, dark: theme.dark },
		defaultColor: "light-dark()",
	});
};

self.onmessage = async ({ data }: MessageEvent<WorkerRequest>) => {
	if (data.type === "tokens") {
		const result = await getTokens(data);
		const response: WorkerResponse = { id: data.id, type: "tokens", result };
		self.postMessage(response);
		return;
	}

	if (data.type === "html") {
		const result = await getHTML(data);
		const response: WorkerResponse = { id: data.id, type: "html", result };
		self.postMessage(response);
		return;
	}

	assertNever(data);
};
