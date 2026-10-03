import { extendObjectProperties } from "#utilities";
import {
	createEmitter,
	createStateEmitter,
	mediaTypes,
	type StateEmitter,
} from "../_Utilities";
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
	UpdateElementStateParams,
	UpdateStateParams,
	UploadStatus,
} from "./EmptyMediaAdapter-types";

export const createEmptyMediaAdapter = (
	...params: CreateEmptyMediaAdapterParams
): CreateEmptyMediaAdapterResult => {
	const [{ uploadFile }, { adapterBus }] = params;

	adapterBus.registerAdapter("emptyMedia");

	const internals: EmptyMediaInternals = {
		// Rest
		registerSlottedElement: null,
	};

	// Per-element upload status, keyed by slotted element.
	const elements: Map<HTMLDivElement, StateEmitter<UploadStatus>> = new Map();
	const disposes: Map<HTMLDivElement, () => void> = new Map();

	// States
	const canInsertState = createStateEmitter<boolean>(false);

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const resolveEmitter = createEmitter<OnResolveCallbackFn>();

	const getUploadStatusState = (
		element: HTMLDivElement,
	): StateEmitter<UploadStatus> => {
		const uploadStatusState = elements.get(element);

		if (!uploadStatusState) {
			throw new Error("No attached state for the given element.");
		}

		return uploadStatusState;
	};

	const updateState = ({ canInsert }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			canInsertState.set(canInsert);
		}
	};

	const updateElementState = ({
		element,
		uploadStatus,
	}: UpdateElementStateParams) => {
		if (uploadStatus !== undefined) {
			const uploadStatusState = getUploadStatusState(element);

			uploadStatusState.set(uploadStatus);
		}
	};

	const configPort: EmptyMediaConfigPort = extendObjectProperties({}, {
		get uploadFile() {
			return uploadFile;
		},

		createSlottedElement() {
			const container = document.createElement("div");

			const uploadStatusState = createStateEmitter<UploadStatus>({
				status: "idle",
			});

			elements.set(container, uploadStatusState);

			const dispose = internals.registerSlottedElement?.(container);

			if (dispose) {
				disposes.set(container, dispose);
			}

			return container;
		},

		removeSlottedElement(container) {
			if (!elements.has(container)) {
				throw new Error("Container wasn't registered.");
			}

			const dispose = disposes.get(container);
			dispose?.();
			disposes.delete(container);
			elements.delete(container);
		},

		updateState(params) {
			updateState(params);
		},

		updateElementState({ element, uploadStatus }) {
			if (!elements.has(element)) {
				return;
			}

			updateElementState({ element, uploadStatus });
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

		emitMediaResolve(params) {
			adapterBus.emitMediaResolve(params);
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

			for (const element of elements.keys()) {
				disposes.get(element)?.();

				const dispose = internals.registerSlottedElement(element);
				disposes.set(element, dispose);
			}
		},

		onCanInsertUpdate(callback) {
			return canInsertState.subscribe(callback);
		},

		getUploadStatus(element) {
			const uploadStatusState = getUploadStatusState(element);

			return uploadStatusState.get();
		},

		onUploadStatusUpdate(element, callback) {
			const uploadStatusState = getUploadStatusState(element);

			return uploadStatusState.subscribe(callback);
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
