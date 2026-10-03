import type { CreateAdapterParams } from "../_Utilities";

export interface ReadOnlyState {
	checked?: boolean;
}

export type OnCheckedUpdateCallbackFn = (checked: boolean) => void;

export type OnToggleCallbackFn = (checked: boolean) => void;

export interface UpdateStateParams extends ReadOnlyState {}

export interface ReadOnlyConfigPortProps {
	updateState(params: UpdateStateParams): void;

	onToggle(callback: OnToggleCallbackFn): () => void;
}

export interface ReadOnlyConfigPort extends ReadOnlyConfigPortProps {}

export interface ReadOnlyPublicPortProps {
	readonly checked: boolean;

	onCheckedUpdate(callback: OnCheckedUpdateCallbackFn): () => void;

	toggle(): void;
}

export interface ReadOnlyPublicPort extends ReadOnlyPublicPortProps {}

export interface ReadOnlyAdapter {
	configPort: ReadOnlyConfigPort;
	publicPort: ReadOnlyPublicPort;
}

export interface ReadOnlySettings {}

export interface CreateReadOnlyAdapterParams
	extends CreateAdapterParams<ReadOnlySettings> {}

export interface CreateReadOnlyAdapterResult extends ReadOnlyAdapter {}
