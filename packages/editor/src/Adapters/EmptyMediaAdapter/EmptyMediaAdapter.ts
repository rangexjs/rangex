import { extendObjectProperties } from "#utilities";
import { createEmitter, createStateEmitter, mediaTypes } from "../_Utilities";
import type {
	CreateEmptyMediaAdapterParams,
	CreateEmptyMediaAdapterResult,
	EmptyMediaConfigPort,
	EmptyMediaConfigPortProps,
	EmptyMediaInternals,
	EmptyMediaPublicPort,
	EmptyMediaPublicPortProps,
	OnInsertCallbackFn,
	OnResolveCallbackFn,
	UpdateStateParams,
} from "./EmptyMediaAdapter-types";

export const createEmptyMediaAdapter = (
	...params: CreateEmptyMediaAdapterParams
): CreateEmptyMediaAdapterResult => {
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("emptyMedia");

	const internals: EmptyMediaInternals = {
		// Rest
		registerSlottedElement: null,
	};

	const slottedElements: Set<HTMLDivElement> = new Set();
	const disposes: Map<HTMLDivElement, () => void> = new Map();

	// States
	const canInsertState = createStateEmitter<boolean>(false);

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const resolveEmitter = createEmitter<OnResolveCallbackFn>();

	const updateState = ({ canInsert }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			canInsertState.set(canInsert);
		}
	};

	const configPort: EmptyMediaConfigPort = extendObjectProperties({}, {
		createSlottedElement() {
			const container = document.createElement("div");

			slottedElements.add(container);

			const dispose = internals.registerSlottedElement?.(container);

			if (dispose) {
				disposes.set(container, dispose);
			}

			return container;
		},

		removeSlottedElement(container) {
			if (!slottedElements.has(container)) {
				throw new Error("Container wasn't registered.");
			}

			const dispose = disposes.get(container);
			dispose?.();
			disposes.delete(container);
			slottedElements.delete(container);
		},

		updateState(params) {
			updateState(params);
		},

		onInsert(callback) {
			return insertEmitter.subscribe(callback);
		},

		onSwap(callback) {
			const cleanup = adapterBus.onSwapToEmptyMedia(callback);
			return () => cleanup();
		},

		onResolve(callback) {
			return resolveEmitter.subscribe(callback);
		},

		emitMediaResolve(detail) {
			adapterBus.emitMediaResolve(detail);
		},
	} satisfies EmptyMediaConfigPortProps);

	const publicPort: EmptyMediaPublicPort = extendObjectProperties({}, {
		get canInsert() {
			return canInsertState.get();
		},

		get supportedMediaTypes() {
			return mediaTypes.filter((type) => adapterBus.hasAdapter(type));
		},

		registerSlottedElement(callback) {
			internals.registerSlottedElement = callback;

			for (const element of slottedElements) {
				disposes.get(element)?.();

				const dispose = internals.registerSlottedElement(element);
				disposes.set(element, dispose);
			}
		},

		onCanInsertUpdate(callback) {
			return canInsertState.subscribe(callback);
		},

		insert() {
			insertEmitter.emit();
		},

		resolve(params) {
			resolveEmitter.emit(params);
		},
	} satisfies EmptyMediaPublicPortProps);

	return { configPort, publicPort };
};
