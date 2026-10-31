import { createEmitter } from "../CreateEmitter";
import type { AdapterName } from "../Utilities-types";
import type {
	AttrValidatorsAdapterName,
	AttrValidatorsByAdapter,
	MediaResolveDetail,
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
 * Lets Adapters talk to each other and share what they provide (e.g. which Adapters the editor was built with), without
 * holding direct references to one another. What the Adapters register is only complete once every Adapter has been
 * created, so read it from the configure phase on. The attribute validators are the exception: createEditor registers
 * them from the SnapshotSchema before any Adapter is created.
 */
export class AdapterBus {
	#registeredAdapters: Set<AdapterName> = new Set();

	#registeredAttrValidators = new Map<
		AttrValidatorsAdapterName,
		AttrValidatorsByAdapter[AttrValidatorsAdapterName]
	>();

	#mediaResolveEmitter = createEmitter<OnMediaResolveCallbackFn>();
	#swapToEmptyMediaEmitter = createEmitter<OnSwapToEmptyMediaCallbackFn>();

	registerAdapter(name: AdapterName) {
		this.#registeredAdapters.add(name);
	}

	hasAdapter(name: AdapterName): boolean {
		return this.#registeredAdapters.has(name);
	}

	registerAttrValidators<Name extends AttrValidatorsAdapterName>(
		name: Name,
		attrValidators: AttrValidatorsByAdapter[Name],
	) {
		this.#registeredAttrValidators.set(name, attrValidators);
	}

	getAttrValidators<Name extends AttrValidatorsAdapterName>(
		name: Name,
	): AttrValidatorsByAdapter[Name] {
		const attrValidators = this.#registeredAttrValidators.get(name);

		if (!attrValidators) {
			throw new Error(
				`${name} Adapter's attribute validators weren't registered: add it to the SnapshotSchema's components.`,
			);
		}

		return attrValidators as AttrValidatorsByAdapter[Name];
	}

	onMediaResolve(callback: OnMediaResolveCallbackFn) {
		return this.#mediaResolveEmitter.subscribe(callback);
	}

	emitMediaResolve(params: MediaResolveDetail) {
		this.#mediaResolveEmitter.emit(params);
	}

	onSwapToEmptyMedia(callback: OnSwapToEmptyMediaCallbackFn) {
		return this.#swapToEmptyMediaEmitter.subscribe(callback);
	}

	emitSwapToEmptyMedia() {
		this.#swapToEmptyMediaEmitter.emit();
	}
}
