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
	QuickActionsConfigPort,
	QuickActionsPublicPort,
	SwapToEmptyMediaConfigPort,
	SwapToEmptyMediaPublicPort,
} from "../_Utilities";

export interface ImageConfigPortProps {
	readonly blockResize: BlockResize;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface ImageConfigPort
	extends ImageConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort,
		CurrentBlockConfigPort,
		CommitSnapshotConfigPort,
		SwapToEmptyMediaConfigPort,
		QuickActionsConfigPort {}

export interface ImagePublicPortProps {}

export interface ImagePublicPort
	extends ImagePublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentBlockPublicPort,
		CommitSnapshotPublicPort,
		SwapToEmptyMediaPublicPort,
		QuickActionsPublicPort {}

export interface ImageAdapter {
	configPort: ImageConfigPort;
	publicPort: ImagePublicPort;
}

export interface ImageSettings {}

export interface CreateImageAdapterParams
	extends CreateAdapterParams<ImageSettings> {}

export interface CreateImageAdapterResult extends ImageAdapter {}
