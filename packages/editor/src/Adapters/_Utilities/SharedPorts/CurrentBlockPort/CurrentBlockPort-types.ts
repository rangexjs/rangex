export interface CurrentBlockInternals {
	currentBlock: HTMLElement | null;
}

export interface UpdateStateParams {
	currentBlock?: HTMLElement | null;
}

export interface CurrentBlockConfigPort {
	setCurrentBlock(currentBlock: HTMLElement | null): void;
}

export type OnCurrentBlockUpdateCallbackFn = (
	currentBlock: HTMLElement | null,
) => void;

export interface CurrentBlockPublicPort {
	readonly currentBlock: HTMLElement | null;

	onCurrentBlockUpdate(callback: OnCurrentBlockUpdateCallbackFn): () => void;
}

export interface CurrentBlockPort {
	configPort: CurrentBlockConfigPort;
	publicPort: CurrentBlockPublicPort;
}

export interface CreateCurrentBlockPortResult extends CurrentBlockPort {}
