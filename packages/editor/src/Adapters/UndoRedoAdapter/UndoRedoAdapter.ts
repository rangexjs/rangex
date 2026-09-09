import { extendObjectProperties } from "#utilities";
import type {
	CreateUndoRedoAdapterParams,
	CreateUndoRedoAdapterResult,
	OnCanStepBackUpdateCallbackFn,
	OnCanStepForwardUpdateCallbackFn,
	OnStepBackCallbackFn,
	OnStepForwardCallbackFn,
	UndoRedoConfigPort,
	UndoRedoConfigPortProps,
	UndoRedoInternals,
	UndoRedoPublicPort,
	UndoRedoPublicPortProps,
	UpdateStateParams,
} from "./UndoRedoAdapter-types";

export const createUndoRedoAdapter = (
	...params: CreateUndoRedoAdapterParams
): CreateUndoRedoAdapterResult => {
	const [_settings, _options] = params;

	const internals: UndoRedoInternals = {
		canStepBack: false,
		canStepForward: false,
	};

	// ConfigPort
	const onStepBackListeners: Set<OnStepBackCallbackFn> = new Set();
	const onStepForwardListeners: Set<OnStepForwardCallbackFn> = new Set();

	// PublicPort
	const onCanStepBackUpdateListeners: Set<OnCanStepBackUpdateCallbackFn> =
		new Set();
	const onCanStepForwardUpdateListeners: Set<OnCanStepForwardUpdateCallbackFn> =
		new Set();

	const updateState = ({ canStepBack, canStepForward }: UpdateStateParams) => {
		if (canStepBack !== undefined) {
			internals.canStepBack = canStepBack;

			for (const listener of onCanStepBackUpdateListeners) {
				listener(internals.canStepBack);
			}
		}

		if (canStepForward !== undefined) {
			internals.canStepForward = canStepForward;

			for (const listener of onCanStepForwardUpdateListeners) {
				listener(internals.canStepForward);
			}
		}
	};

	const configPort: UndoRedoConfigPort = extendObjectProperties({}, {
		updateState(params) {
			updateState(params);
		},

		onStepBack(callback) {
			onStepBackListeners.add(callback);
			return () => onStepBackListeners.delete(callback);
		},

		onStepForward(callback) {
			onStepForwardListeners.add(callback);
			return () => onStepForwardListeners.delete(callback);
		},
	} satisfies UndoRedoConfigPortProps);

	const publicPort: UndoRedoPublicPort = extendObjectProperties({}, {
		get canStepBack() {
			return internals.canStepBack;
		},

		get canStepForward() {
			return internals.canStepForward;
		},

		onCanStepBackUpdate(callback) {
			onCanStepBackUpdateListeners.add(callback);
			return () => onCanStepBackUpdateListeners.delete(callback);
		},

		onCanStepForwardUpdate(callback) {
			onCanStepForwardUpdateListeners.add(callback);
			return () => onCanStepForwardUpdateListeners.delete(callback);
		},

		stepBack() {
			for (const listener of onStepBackListeners) {
				listener();
			}
		},

		stepForward() {
			for (const listener of onStepForwardListeners) {
				listener();
			}
		},
	} satisfies UndoRedoPublicPortProps);

	return { configPort, publicPort };
};
