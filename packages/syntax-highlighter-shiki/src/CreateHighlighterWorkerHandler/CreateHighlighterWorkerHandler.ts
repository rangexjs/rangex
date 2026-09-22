import type {
	CodeBlockTheme,
	HighlightInfo,
	ThemedCodeLine,
	ThemedCodeLines,
} from "@rangex/editor";
import type { HighlighterCore } from "@shikijs/core";
import { createHighlighterCore } from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import type {
	CreateHighlighterWorkerHandlerParams,
	WorkerRequest,
	WorkerResponse,
} from "./CreateHighlighterWorkerHandler-types";

const getTokens = async (
	highlighterPromise: Promise<HighlighterCore>,
	{ lines, language, theme }: WorkerRequest,
): Promise<HighlightInfo> => {
	const highlighter = await highlighterPromise;
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

/*
 * Builds a Shiki highlighter core from the given languages/themes and wires this worker's
 * `onmessage` to answer `getHighlightInfo` requests against it. `langs`/`themes` are expected to
 * be fine-grained-bundle inputs (e.g. `() => import("@shikijs/langs/typescript")`) so the bundler
 * only emits chunks for what the consumer actually configured, not Shiki's full catalog.
 *
 * If the requested language/theme wasn't among the loaded `langs`/`themes` (e.g. the adapter was
 * configured with an id that was never wired into this worker), Shiki throws — that's caught here
 * and answered with a `null` result instead, which callers treat as "no highlight available".
 */
export const createHighlighterWorkerHandler = ({
	langs,
	themes,
}: CreateHighlighterWorkerHandlerParams) => {
	const highlighterPromise = createHighlighterCore({
		langs,
		themes,
		engine: createJavaScriptRegexEngine(),
	});

	self.onmessage = async ({ data }: MessageEvent<WorkerRequest>) => {
		const result = await (async () => {
			try {
				return await getTokens(highlighterPromise, data);
			} catch (error) {
				console.warn(
					`[syntax-highlighter-shiki] Failed to highlight language "${data.language}" with theme "${data.theme.light}"/"${data.theme.dark}".`,
					error,
				);
				return null;
			}
		})();

		const response: WorkerResponse = { id: data.id, result };
		self.postMessage(response);
	};
};
