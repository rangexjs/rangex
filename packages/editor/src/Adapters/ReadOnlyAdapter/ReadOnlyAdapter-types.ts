import type { CreateAdapterParams } from "../_Utilities";

export interface ReadOnlyState {
  isEnabled?: boolean;
}

export type OnIsEnabledUpdateCallbackFn = (isEnabled: boolean) => void;

export interface OnToggleCallbackParams {
  isEnabled: boolean;
  force: boolean | undefined;
}

export type OnToggleCallbackFn = (params: OnToggleCallbackParams) => void;

export interface UpdateStateParams extends ReadOnlyState {}

export interface ToggleParams {
  force?: boolean;
}

export interface ReadOnlyConfigPortProps {
  readonly initialEnabled: boolean;

  updateState(params: UpdateStateParams): void;

  onToggle(callback: OnToggleCallbackFn): () => void;
}

export interface ReadOnlyConfigPort extends ReadOnlyConfigPortProps {}

export interface ReadOnlyPublicPortProps {
  readonly isEnabled: boolean;

  onIsEnabledUpdate(callback: OnIsEnabledUpdateCallbackFn): () => void;

  toggle(params: ToggleParams): void;
}

export interface ReadOnlyPublicPort extends ReadOnlyPublicPortProps {}

export interface ReadOnlyAdapter {
  configPort: ReadOnlyConfigPort;
  publicPort: ReadOnlyPublicPort;
}

export interface ReadOnlySettings {
  initialEnabled?: boolean;
}

export interface CreateReadOnlyAdapterParams extends CreateAdapterParams<ReadOnlySettings> {}

export interface CreateReadOnlyAdapterResult extends ReadOnlyAdapter {}
