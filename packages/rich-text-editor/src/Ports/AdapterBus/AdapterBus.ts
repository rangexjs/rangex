import type { MediaResolveParams, OnMediaResolveFn } from "./AdapterBus-types";

/**
 * Lets Adapters talk to each other without holding direct references to one another, each
 * channel a matched `onXxx`/`emitXxx` pair.
 */
export class AdapterBus {
	#mediaResolveListeners: Set<OnMediaResolveFn> = new Set();

	onMediaResolve(callback: OnMediaResolveFn) {
		this.#mediaResolveListeners.add(callback);
		return () => this.#mediaResolveListeners.delete(callback);
	}

	emitMediaResolve(params: MediaResolveParams) {
		for (const listener of this.#mediaResolveListeners) {
			listener(params);
		}
	}
}
