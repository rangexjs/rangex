import type { GetHighlightInfoFn } from "@rangex/editor/code-block";
import type {
	WorkerRequest,
	WorkerResponse,
} from "../InitEditorHighlighterWorker";

/*
 * Wraps a consumer-supplied Shiki worker (built with `initEditorHighlighterWorker`) into a
 * `getHighlightInfo` function, correlating each call with its response over `postMessage` by an
 * incrementing id.
 */
export const createEditorHighlighter = (worker: Worker): GetHighlightInfoFn => {
	const pendingRequests = new Map<number, (response: WorkerResponse) => void>();
	let nextId = 0;

	worker.onmessage = ({ data }: MessageEvent<WorkerResponse>) => {
		const resolve = pendingRequests.get(data.id);
		resolve?.(data);
		pendingRequests.delete(data.id);
	};

	return ({ lines, language, theme }) => {
		return new Promise((resolve) => {
			const id = nextId++;

			pendingRequests.set(id, (response) => {
				resolve(response.result);
			});

			const request: WorkerRequest = { id, lines, language, theme };
			worker.postMessage(request);
		});
	};
};
