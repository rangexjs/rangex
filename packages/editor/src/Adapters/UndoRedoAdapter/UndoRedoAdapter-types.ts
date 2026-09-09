import type { CreateAdapterParams } from "../_Utilities";

export interface UndoRedoState {
	canStepBack?: boolean;
	canStepForward?: boolean;
}

export interface UpdateStateParams extends UndoRedoState {}

export type OnStepBackCallbackFn = () => void;
export type OnStepForwardCallbackFn = () => void;

export interface UndoRedoConfigPortProps {
	updateState(params: UpdateStateParams): void;

	onStepBack(callback: OnStepBackCallbackFn): () => void;
	onStepForward(callback: OnStepForwardCallbackFn): () => void;
}

export interface UndoRedoConfigPort extends UndoRedoConfigPortProps {}

export type OnCanStepBackUpdateCallbackFn = (canStepBack: boolean) => void;
export type OnCanStepForwardUpdateCallbackFn = (
	canStepForward: boolean,
) => void;

export interface UndoRedoPublicPortProps {
	readonly canStepBack: boolean;
	readonly canStepForward: boolean;

	onCanStepBackUpdate(callback: OnCanStepBackUpdateCallbackFn): () => void;
	onCanStepForwardUpdate(
		callback: OnCanStepForwardUpdateCallbackFn,
	): () => void;

	stepBack(): void;
	stepForward(): void;
}

export interface UndoRedoPublicPort extends UndoRedoPublicPortProps {}

export interface UndoRedoInternals {
	canStepBack: boolean;
	canStepForward: boolean;
}

export interface UndoRedoAdapter {
	configPort: UndoRedoConfigPort;
	publicPort: UndoRedoPublicPort;
}

export interface UndoRedoSettings {}

export interface CreateUndoRedoAdapterParams
	extends CreateAdapterParams<UndoRedoSettings> {}

export interface CreateUndoRedoAdapterResult extends UndoRedoAdapter {}
