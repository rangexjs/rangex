import { createEmitter } from "../CreateEmitter";
import type { AdapterName } from "../Utilities-types";
import type {
	MediaResolveCallbackParams,
	OnMediaResolveCallbackFn,
	OnSwapToEmptyMediaCallbackFn,
} from "./AdapterBus-types";

/**
 * Lets Adapters talk to each other without holding direct references to one another. Two
 * channel shapes coexist here, picked per the data's own nature: a transient event
 * (`onXxx`/`emitXxx`, fire-and-forget, never cached) for something that happens, and the
 * adapter registry (`registerAdapter`/`hasAdapter`) for which Adapters the editor was built with.
 *
 * The registry is sealed once every Adapter has been created, so a lookup never depends on
 * Adapter creation order: `registerAdapter` is only allowed before `seal()`, `hasAdapter` only
 * after it. Adapters therefore read `hasAdapter` lazily (getters, event handlers), never while
 * they are being created or configured.
 */
export class AdapterBus {
	#registeredAdapters: Set<AdapterName> = new Set();
	#isSealed = false;

	#mediaResolveEmitter = createEmitter<OnMediaResolveCallbackFn>();
	#swapToEmptyMediaEmitter = createEmitter<OnSwapToEmptyMediaCallbackFn>();

	registerAdapter(name: AdapterName) {
		if (this.#isSealed) {
			throw new Error(
				`Adapter "${name}" registered after the AdapterBus was sealed.`,
			);
		}

		this.#registeredAdapters.add(name);
	}

	seal() {
		this.#isSealed = true;
	}

	hasAdapter(name: AdapterName): boolean {
		if (!this.#isSealed) {
			throw new Error(
				`hasAdapter("${name}") called before every Adapter was registered.`,
			);
		}

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
