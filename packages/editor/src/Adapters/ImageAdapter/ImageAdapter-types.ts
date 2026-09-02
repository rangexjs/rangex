import type {
	BlockAlignConfigPort,
	BlockAlignPublicPort,
	BlockResize,
	CaptionConfigPort,
	CaptionPublicPort,
	CreateAdapterParams,
	OnMediaResolveCallbackFn,
} from "../_Utilities";

export interface ImageState {
	isOpen?: boolean;
}

export interface UpdateStateParams extends ImageState {}

export interface ImageConfigPortProps {
	readonly blockResize: BlockResize;
	readonly floatingEl: HTMLDivElement;

	updateState(params: UpdateStateParams): void;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface ImageConfigPort
	extends ImageConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort {}

export type OnIsOpenUpdateCallbackFn = (value: boolean) => void;

export interface ImagePublicPortProps {
	readonly floatingEl: HTMLDivElement;

	readonly isOpen: boolean;

	onIsOpenUpdate(callback: OnIsOpenUpdateCallbackFn): () => void;
}

export interface ImagePublicPort
	extends ImagePublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort {}

export interface ImageInternals {
	isOpen: boolean;
}

export interface ImageAdapter {
	configPort: ImageConfigPort;
	publicPort: ImagePublicPort;
}

export interface Settings {}

export interface CreateImageAdapterParams
	extends CreateAdapterParams<Settings> {}

export interface CreateImageAdapterResult extends ImageAdapter {}
