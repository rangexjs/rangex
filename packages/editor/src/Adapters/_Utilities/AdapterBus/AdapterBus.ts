import { createEmitter } from "../CreateEmitter";
import type { AdapterName } from "../Utilities-types";
import type {
	MediaResolveCallbackParams,
	OnMediaResolveCallbackFn,
	OnSwapToEmptyMediaCallbackFn,
} from "./AdapterBus-types";

export const mediaTypes = [
	"audio",
	"embed",
	"image",
	"video",
] satisfies AdapterName[];

/**
 * Lets Adapters talk to each other without holding direct references to one another. Two
 * channel shapes coexist here, picked per the data's own nature: a transient event
 * (`onXxx`/`emitXxx`, fire-and-forget, never cached) for something that happens, and the
 * adapter registry (`registerAdapter`/`hasAdapter`) for which Adapters the editor was built with.
 * The registry is only complete once every Adapter has been created, so `hasAdapter` is only
 * meaningful from the configure phase on, never during Adapter creation.
 */
export class AdapterBus {
	#registeredAdapters: Set<AdapterName> = new Set();

	#mediaResolveEmitter = createEmitter<OnMediaResolveCallbackFn>();
	#swapToEmptyMediaEmitter = createEmitter<OnSwapToEmptyMediaCallbackFn>();

	registerAdapter(name: AdapterName) {
		this.#registeredAdapters.add(name);
	}

	hasAdapter(name: AdapterName): boolean {
		return this.#registeredAdapters.has(name);
	}

	onMediaResolve(callback: OnMediaResolveCallbackFn) {
		return this.#mediaResolveEmitter.subscribe(callback);
	}

	emitMediaResolve(params: MediaResolveCallbackParams) {
		this.#mediaResolveEmitter.emit(params);
	}

	onSwapToEmptyMedia(callback: OnSwapToEmptyMediaCallbackFn) {
		return this.#swapToEmptyMediaEmitter.subscribe(callback);
	}

	emitSwapToEmptyMedia() {
		this.#swapToEmptyMediaEmitter.emit();
	}
}
