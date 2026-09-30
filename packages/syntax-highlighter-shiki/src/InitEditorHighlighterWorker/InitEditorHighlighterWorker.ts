import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { tokenizeCode } from "../_Utilities";
import type {
	InitEditorHighlighterWorkerParams,
	WorkerRequest,
	WorkerResponse,
} from "./InitEditorHighlighterWorker-types";

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
export const initEditorHighlighterWorker = ({
	langs,
	themes,
}: InitEditorHighlighterWorkerParams) => {
	const highlighterPromise = createHighlighterCore({
		langs,
		themes,
		engine: createJavaScriptRegexEngine(),
	});

	self.onmessage = async ({ data }: MessageEvent<WorkerRequest>) => {
		const result = await (async () => {
			try {
				const highlighter = await highlighterPromise;
				const { lines, language, theme } = data;

				return tokenizeCode({ highlighter, lines, language, theme });
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
