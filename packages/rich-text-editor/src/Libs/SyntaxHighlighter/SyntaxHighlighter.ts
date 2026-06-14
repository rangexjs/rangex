import type {
	GetHighlightInfoParams,
	GetHighlightInfoResult,
	HighlightInfo,
} from "./SyntaxHighlighter-types";
import type { WorkerRequest, WorkerResponse } from "./Worker/Worker-types";
import WorkerConstructor from "./Worker?worker";

export {
	highlighterLangs,
	highlighterThemes,
} from "./SyntaxHighlighter-constants";

class SyntaxHighlighter {
	#worker = new WorkerConstructor();
	#pendingRequests = new Map<number, (result: HighlightInfo) => void>();
	#nextId = 0;

	constructor() {
		this.#worker.onmessage = ({ data }: MessageEvent<WorkerResponse>) => {
			const resolve = this.#pendingRequests.get(data.id);
			resolve?.(data.result);
			this.#pendingRequests.delete(data.id);
		};
	}

	/**
	 * Transform code lines into theme-aware syntax-highlighted tokens.
	 * Joins lines (separated by "\n") and tokenizes the code for syntax
	 * highlighting, extracting color variants for each token across all
	 * themes and background colors for each theme.
	 */
	async getHighlightInfo({
		lines,
		lang,
	}: GetHighlightInfoParams): GetHighlightInfoResult {
		return new Promise((resolve) => {
			const id = this.#nextId++;
			this.#pendingRequests.set(id, resolve);

			const request: WorkerRequest = { id, lines, lang };
			this.#worker.postMessage(request);
		});
	}
}

export const syntaxHighlighter = Object.freeze(new SyntaxHighlighter());
