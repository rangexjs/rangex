import { createHighlighterCore } from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import { assertNever } from "#ports";
import { highlighterThemes } from "../SyntaxHighlighter-constants";
import type {
	HighlightInfo,
	ThemeBackgrounds,
	ThemedCodeLine,
	ThemedCodeLines,
	ThemeForegrounds,
	TokenColors,
} from "../SyntaxHighlighter-types";
import type {
	HTMLRequest,
	TokensRequest,
	WorkerRequest,
	WorkerResponse,
} from "./Worker-types";

const highlighterPromise = createHighlighterCore({
	langs: [
		() => import("@shikijs/langs/bash"),
		() => import("@shikijs/langs/c"),
		() => import("@shikijs/langs/cpp"),
		() => import("@shikijs/langs/csharp"),
		() => import("@shikijs/langs/css"),
		() => import("@shikijs/langs/dart"),
		() => import("@shikijs/langs/go"),
		() => import("@shikijs/langs/html"),
		() => import("@shikijs/langs/java"),
		() => import("@shikijs/langs/javascript"),
		() => import("@shikijs/langs/json"),
		() => import("@shikijs/langs/kotlin"),
		() => import("@shikijs/langs/markdown"),
		() => import("@shikijs/langs/php"),
		() => import("@shikijs/langs/python"),
		() => import("@shikijs/langs/ruby"),
		() => import("@shikijs/langs/rust"),
		() => import("@shikijs/langs/sql"),
		() => import("@shikijs/langs/swift"),
		() => import("@shikijs/langs/tsx"),
		() => import("@shikijs/langs/typescript"),
	],
	themes: [
		() => import("@shikijs/themes/catppuccin-mocha"),
		() => import("@shikijs/themes/dark-plus"),
		() => import("@shikijs/themes/dracula"),
		() => import("@shikijs/themes/github-dark"),
		() => import("@shikijs/themes/github-light"),
		() => import("@shikijs/themes/light-plus"),
		() => import("@shikijs/themes/monokai"),
		() => import("@shikijs/themes/nord"),
		() => import("@shikijs/themes/one-dark-pro"),
		() => import("@shikijs/themes/solarized-dark"),
		() => import("@shikijs/themes/solarized-light"),
		() => import("@shikijs/themes/tokyo-night"),
	],
	engine: createJavaScriptRegexEngine(),
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

	const foregrounds = highlighterThemes.reduce<ThemeForegrounds>(
		(variants, theme) => {
			const { fg } = highlighter.getTheme(theme);

			variants[theme] = fg;

			return variants;
		},
		{} as ThemeForegrounds,
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

	return { backgrounds, foregrounds, codeLines };
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
