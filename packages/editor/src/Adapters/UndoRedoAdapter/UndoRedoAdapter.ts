import { extendObjectProperties } from "#utilities";
import { createEmitter } from "../_Utilities";
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
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("undoRedo");

	const internals: UndoRedoInternals = {
		// States
		canStepBack: false,
		canStepForward: false,
	};

	// StateListeners
	const canStepBackUpdateEmitter =
		createEmitter<OnCanStepBackUpdateCallbackFn>();
	const canStepForwardUpdateEmitter =
		createEmitter<OnCanStepForwardUpdateCallbackFn>();

	// CommandListeners
	const stepBackEmitter = createEmitter<OnStepBackCallbackFn>();
	const stepForwardEmitter = createEmitter<OnStepForwardCallbackFn>();

	const updateState = ({ canStepBack, canStepForward }: UpdateStateParams) => {
		if (canStepBack !== undefined) {
			internals.canStepBack = canStepBack;

			canStepBackUpdateEmitter.emit(internals.canStepBack);
		}

		if (canStepForward !== undefined) {
			internals.canStepForward = canStepForward;

			canStepForwardUpdateEmitter.emit(internals.canStepForward);
		}
	};

	const configPort: UndoRedoConfigPort = extendObjectProperties({}, {
		updateState(params) {
			updateState(params);
		},

		onStepBack(callback) {
			return stepBackEmitter.subscribe(callback);
		},

		onStepForward(callback) {
			return stepForwardEmitter.subscribe(callback);
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
			return canStepBackUpdateEmitter.subscribe(callback);
		},

		onCanStepForwardUpdate(callback) {
			return canStepForwardUpdateEmitter.subscribe(callback);
		},

		stepBack() {
			stepBackEmitter.emit();
		},

		stepForward() {
			stepForwardEmitter.emit();
		},
	} satisfies UndoRedoPublicPortProps);

	return { configPort, publicPort };
};
