import type { CreateAdapterParams } from "../_Utilities";

export interface ReadOnlyState {
  checked?: boolean;
}

export type OnCheckedUpdateCallbackFn = (checked: boolean) => void;

export interface OnToggleCallbackParams {
  checked: boolean;
  force: boolean | undefined;
}

export type OnToggleCallbackFn = (params: OnToggleCallbackParams) => void;

export interface UpdateStateParams extends ReadOnlyState {}

export interface ToggleParams {
  force?: boolean;
}

export interface ReadOnlyConfigPortProps {
  updateState(params: UpdateStateParams): void;

  onToggle(callback: OnToggleCallbackFn): () => void;
}

export interface ReadOnlyConfigPort extends ReadOnlyConfigPortProps {}

export interface ReadOnlyPublicPortProps {
  readonly checked: boolean;

  onCheckedUpdate(callback: OnCheckedUpdateCallbackFn): () => void;

  toggle(params: ToggleParams): void;
}

export interface ReadOnlyPublicPort extends ReadOnlyPublicPortProps {}

export interface ReadOnlyAdapter {
  configPort: ReadOnlyConfigPort;
  publicPort: ReadOnlyPublicPort;
}

export interface ReadOnlySettings {}

export interface CreateReadOnlyAdapterParams extends CreateAdapterParams<ReadOnlySettings> {}

export interface CreateReadOnlyAdapterResult extends ReadOnlyAdapter {}
