import type {
	BlockAlignConfigPort,
	BlockAlignPublicPort,
	BlockResize,
	CaptionConfigPort,
	CaptionPublicPort,
	CommitSnapshotConfigPort,
	CommitSnapshotPublicPort,
	CreateAdapterParams,
	CurrentBlockConfigPort,
	CurrentBlockPublicPort,
	OnMediaResolveCallbackFn,
	SwapToEmptyMediaConfigPort,
	SwapToEmptyMediaPublicPort,
} from "../_Utilities";

export interface EmbedState {
	isOpen?: boolean;
}

export interface UpdateStateParams extends EmbedState {}

export interface EmbedConfigPortProps {
	readonly blockResize: BlockResize;
	readonly floatingEl: HTMLDivElement;

	updateState(params: UpdateStateParams): void;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface EmbedConfigPort
	extends EmbedConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort,
		CurrentBlockConfigPort,
		CommitSnapshotConfigPort,
		SwapToEmptyMediaConfigPort {}

export type OnIsOpenUpdateCallbackFn = (value: boolean) => void;

export interface EmbedPublicPortProps {
	readonly floatingEl: HTMLDivElement;

	readonly isOpen: boolean;

	onIsOpenUpdate(callback: OnIsOpenUpdateCallbackFn): () => void;
}

export interface EmbedPublicPort
	extends EmbedPublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentBlockPublicPort,
		CommitSnapshotPublicPort,
		SwapToEmptyMediaPublicPort {}

export interface EmbedInternals {
	isOpen: boolean;
}

export interface EmbedAdapter {
	configPort: EmbedConfigPort;
	publicPort: EmbedPublicPort;
}

export interface EmbedSettings {}

export interface CreateEmbedAdapterParams
	extends CreateAdapterParams<EmbedSettings> {}

export interface CreateEmbedAdapterResult extends EmbedAdapter {}
