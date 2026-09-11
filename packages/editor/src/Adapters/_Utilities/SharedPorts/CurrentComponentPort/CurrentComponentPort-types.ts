export interface CurrentComponentInternals {
	currentComponent: HTMLElement | null;
}

export interface UpdateStateParams {
	currentComponent?: HTMLElement | null;
}

export interface CurrentComponentConfigPort {
	setCurrentComponent(currentComponent: HTMLElement | null): void;
}

export type OnCurrentComponentUpdateCallbackFn = (
	currentComponent: HTMLElement | null,
) => void;

export interface CurrentComponentPublicPort {
	readonly currentComponent: HTMLElement | null;

	onCurrentComponentUpdate(
		callback: OnCurrentComponentUpdateCallbackFn,
	): () => void;
}

export interface CurrentComponentPort {
	configPort: CurrentComponentConfigPort;
	publicPort: CurrentComponentPublicPort;
}

export interface CreateCurrentComponentPortResult
	extends CurrentComponentPort {}
