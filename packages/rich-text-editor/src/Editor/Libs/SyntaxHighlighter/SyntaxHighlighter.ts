import type {
	GetHighlightedHTMLParams,
	GetHighlightedHTMLResult,
	GetHighlightInfoParams,
	GetHighlightInfoResult,
} from "./SyntaxHighlighter-types";
import type { WorkerRequest, WorkerResponse } from "./Worker";
import WorkerConstructor from "./Worker?worker";

export {
	highlighterLangs,
	highlighterThemes,
} from "./SyntaxHighlighter-constants";

class SyntaxHighlighter {
	#worker = new WorkerConstructor();
	#pendingRequests = new Map<number, (response: WorkerResponse) => void>();
	#nextId = 0;

	constructor() {
		this.#worker.onmessage = ({ data }: MessageEvent<WorkerResponse>) => {
			const resolve = this.#pendingRequests.get(data.id);
			resolve?.(data);
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

			this.#pendingRequests.set(id, (response) => {
				if (response.type !== "tokens") {
					throw new Error("[SyntaxHighlighter] Expected a tokens response.");
				}

				resolve(response.result);
			});

			const request: WorkerRequest = { id, type: "tokens", lines, lang };
			this.#worker.postMessage(request);
		});
	}

	/**
	 * Tokenize `code` and have Shiki render it straight to highlighted
	 * markup (see {@link Worker}'s `getHTML`).
	 */
	async getHighlightedHTML({
		code,
		lang,
		theme,
	}: GetHighlightedHTMLParams): GetHighlightedHTMLResult {
		return new Promise((resolve) => {
			const id = this.#nextId++;

			this.#pendingRequests.set(id, (response) => {
				if (response.type !== "html") {
					throw new Error("[SyntaxHighlighter] Expected an html response.");
				}

				resolve(response.result);
			});

			const request: WorkerRequest = { id, type: "html", code, lang, theme };
			this.#worker.postMessage(request);
		});
	}
}

export const syntaxHighlighter = Object.freeze(new SyntaxHighlighter());
