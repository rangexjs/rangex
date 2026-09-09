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

export interface AudioState {
	isOpen?: boolean;
}

export interface UpdateStateParams extends AudioState {}

export interface AudioConfigPortProps {
	readonly blockResize: BlockResize;
	readonly floatingEl: HTMLDivElement;

	updateState(params: UpdateStateParams): void;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface AudioConfigPort
	extends AudioConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort,
		CurrentBlockConfigPort,
		CommitSnapshotConfigPort,
		SwapToEmptyMediaConfigPort {}

export type OnIsOpenUpdateCallbackFn = (value: boolean) => void;

export interface AudioPublicPortProps {
	readonly floatingEl: HTMLDivElement;

	readonly isOpen: boolean;

	onIsOpenUpdate(callback: OnIsOpenUpdateCallbackFn): () => void;
}

export interface AudioPublicPort
	extends AudioPublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentBlockPublicPort,
		CommitSnapshotPublicPort,
		SwapToEmptyMediaPublicPort {}

export interface AudioInternals {
	isOpen: boolean;
}

export interface AudioAdapter {
	configPort: AudioConfigPort;
	publicPort: AudioPublicPort;
}

export interface AudioSettings {}

export interface CreateAudioAdapterParams
	extends CreateAdapterParams<AudioSettings> {}

export interface CreateAudioAdapterResult extends AudioAdapter {}
