import type {
	MediaResolveParams,
	MediaResolveType,
	OnMediaResolveFn,
} from "./AdapterBus-types";

/**
 * Lets Adapters talk to each other without holding direct references to one another. Two
 * channel shapes coexist here, picked per the data's own nature: a transient event
 * (`onXxx`/`emitXxx`, fire-and-forget, never cached) for something that happens, and a durable
 * registry (`registerXxx`/`getXxx`, remembered for the editor's whole lifetime, read lazily
 * through a plain getter) for something that just is.
 */
export class AdapterBus {
	#mediaResolveListeners: Set<OnMediaResolveFn> = new Set();
	#supportedMediaTypes: Set<MediaResolveType> = new Set();

	onMediaResolve(callback: OnMediaResolveFn) {
		this.#mediaResolveListeners.add(callback);
		return () => this.#mediaResolveListeners.delete(callback);
	}

	emitMediaResolve(params: MediaResolveParams) {
		for (const listener of this.#mediaResolveListeners) {
			listener(params);
		}
	}

	registerSupportedMediaType(type: MediaResolveType) {
		this.#supportedMediaTypes.add(type);
	}

	getSupportedMediaTypes(): MediaResolveType[] {
		return [...this.#supportedMediaTypes];
	}
}
