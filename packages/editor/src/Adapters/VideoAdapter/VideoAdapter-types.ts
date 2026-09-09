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

export interface VideoConfigPortProps {
	readonly blockResize: BlockResize;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface VideoConfigPort
	extends VideoConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort,
		CurrentBlockConfigPort,
		CommitSnapshotConfigPort,
		SwapToEmptyMediaConfigPort,
		QuickActionsConfigPort {}

export interface VideoPublicPortProps {}

export interface VideoPublicPort
	extends VideoPublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentBlockPublicPort,
		CommitSnapshotPublicPort,
		SwapToEmptyMediaPublicPort,
		QuickActionsPublicPort {}

export interface VideoAdapter {
	configPort: VideoConfigPort;
	publicPort: VideoPublicPort;
}

export interface VideoSettings {}

export interface CreateVideoAdapterParams
	extends CreateAdapterParams<VideoSettings> {}

export interface CreateVideoAdapterResult extends VideoAdapter {}
