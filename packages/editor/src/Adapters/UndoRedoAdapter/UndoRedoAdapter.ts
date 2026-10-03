import { extendObjectProperties } from "#utilities";
import { createEmitter, createStateEmitter } from "../_Utilities";
import type {
	CreateUndoRedoAdapterParams,
	CreateUndoRedoAdapterResult,
	OnStepBackCallbackFn,
	OnStepForwardCallbackFn,
	UndoRedoConfigPort,
	UndoRedoConfigPortProps,
	UndoRedoPublicPort,
	UndoRedoPublicPortProps,
	UpdateStateParams,
} from "./UndoRedoAdapter-types";

export const createUndoRedoAdapter = (
	...params: CreateUndoRedoAdapterParams
): CreateUndoRedoAdapterResult => {
	const [_settings, { adapterBus }] = params;

	adapterBus.registerAdapter("undoRedo");

	// States
	const canStepBackState = createStateEmitter<boolean>(false);
	const canStepForwardState = createStateEmitter<boolean>(false);

	// CommandListeners
	const stepBackEmitter = createEmitter<OnStepBackCallbackFn>();
	const stepForwardEmitter = createEmitter<OnStepForwardCallbackFn>();

	const updateState = ({ canStepBack, canStepForward }: UpdateStateParams) => {
		if (canStepBack !== undefined) {
			canStepBackState.set(canStepBack);
		}

		if (canStepForward !== undefined) {
			canStepForwardState.set(canStepForward);
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
			return canStepBackState.get();
		},

		get canStepForward() {
			return canStepForwardState.get();
		},

		onCanStepBackUpdate(callback) {
			return canStepBackState.subscribe(callback);
		},

		onCanStepForwardUpdate(callback) {
			return canStepForwardState.subscribe(callback);
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
