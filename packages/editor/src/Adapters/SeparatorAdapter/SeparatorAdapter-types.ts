import type { CreateAdapterParams } from "../_Utilities";

export interface SeparatorState {
	canInsert?: boolean;
}

export interface UpdateStateParams extends SeparatorState {}

export type OnInsertCallbackFn = () => void;

export interface SeparatorConfigPortProps {
	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
}

export interface SeparatorConfigPort extends SeparatorConfigPortProps {}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;

export interface SeparatorPublicPortProps {
	readonly canInsert: boolean;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;

	insert(): void;
}

export interface SeparatorPublicPort extends SeparatorPublicPortProps {}

export interface SeparatorAdapter {
	configPort: SeparatorConfigPort;
	publicPort: SeparatorPublicPort;
}

export interface SeparatorSettings {}

export interface CreateSeparatorAdapterParams extends CreateAdapterParams<SeparatorSettings> {}

export interface CreateSeparatorAdapterResult extends SeparatorAdapter {}
