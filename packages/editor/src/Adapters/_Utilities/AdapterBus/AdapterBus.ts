import { createEmitter } from "../CreateEmitter";
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
	#mediaResolveEmitter = createEmitter<OnMediaResolveCallbackFn>();
	#supportedMediaTypes: Set<MediaType> = new Set();

	#swapToEmptyMediaEmitter = createEmitter<OnSwapToEmptyMediaCallbackFn>();
	#emptyMediaAvailable = false;

	onMediaResolve(callback: OnMediaResolveCallbackFn) {
		return this.#mediaResolveEmitter.subscribe(callback);
	}

	emitMediaResolve(params: MediaResolveCallbackParams) {
		this.#mediaResolveEmitter.emit(params);
	}

	registerSupportedMediaType(type: MediaType) {
		this.#supportedMediaTypes.add(type);
	}

	getSupportedMediaTypes(): MediaType[] {
		return [...this.#supportedMediaTypes];
	}

	onSwapToEmptyMedia(callback: OnSwapToEmptyMediaCallbackFn) {
		return this.#swapToEmptyMediaEmitter.subscribe(callback);
	}

	emitSwapToEmptyMedia() {
		this.#swapToEmptyMediaEmitter.emit();
	}

	registerEmptyMediaAvailable() {
		this.#emptyMediaAvailable = true;
	}

	isEmptyMediaAvailable(): boolean {
		return this.#emptyMediaAvailable;
	}
}
