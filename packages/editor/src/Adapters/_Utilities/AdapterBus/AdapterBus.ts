import type {
	MediaResolveCallbackParams,
	MediaType,
	OnMediaResolveCallbackFn,
	OnSwapToEmptyMediaCallbackFn,
} from "./AdapterBus-types";

/**
 * Lets Adapters talk to each other without holding direct references to one another. Two
 * channel shapes coexist here, picked per the data's own nature: a transient event
 * (`onXxx`/`emitXxx`, fire-and-forget, never cached) for something that happens, and a durable
 * registry (`registerXxx`/`getXxx`, remembered for the editor's whole lifetime, read lazily
 * through a plain getter) for something that just is.
 */
export class AdapterBus {
	#mediaResolveListeners: Set<OnMediaResolveCallbackFn> = new Set();
	#supportedMediaTypes: Set<MediaType> = new Set();

	#swapToEmptyMediaListeners: Set<OnSwapToEmptyMediaCallbackFn> = new Set();
	#emptyMediaAvailable = false;

	onMediaResolve(callback: OnMediaResolveCallbackFn) {
		this.#mediaResolveListeners.add(callback);
		return () => this.#mediaResolveListeners.delete(callback);
	}

	emitMediaResolve(params: MediaResolveCallbackParams) {
		for (const listener of this.#mediaResolveListeners) {
			listener(params);
		}
	}

	registerSupportedMediaType(type: MediaType) {
		this.#supportedMediaTypes.add(type);
	}

	getSupportedMediaTypes(): MediaType[] {
		return [...this.#supportedMediaTypes];
	}

	onSwapToEmptyMedia(callback: OnSwapToEmptyMediaCallbackFn) {
		this.#swapToEmptyMediaListeners.add(callback);
		return () => this.#swapToEmptyMediaListeners.delete(callback);
	}

	emitSwapToEmptyMedia() {
		for (const listener of this.#swapToEmptyMediaListeners) {
			listener();
		}
	}

	registerEmptyMediaAvailable() {
		this.#emptyMediaAvailable = true;
	}

	isEmptyMediaAvailable(): boolean {
		return this.#emptyMediaAvailable;
	}
}
