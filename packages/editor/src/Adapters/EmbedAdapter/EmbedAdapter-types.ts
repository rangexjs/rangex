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

export interface EmbedConfigPortProps {
	readonly blockResize: BlockResize;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface EmbedConfigPort
	extends EmbedConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort,
		CurrentBlockConfigPort,
		CommitSnapshotConfigPort,
		SwapToEmptyMediaConfigPort,
		QuickActionsConfigPort {}

export interface EmbedPublicPortProps {}

export interface EmbedPublicPort
	extends EmbedPublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentBlockPublicPort,
		CommitSnapshotPublicPort,
		SwapToEmptyMediaPublicPort,
		QuickActionsPublicPort {}

export interface EmbedAdapter {
	configPort: EmbedConfigPort;
	publicPort: EmbedPublicPort;
}

export interface EmbedSettings {}

export interface CreateEmbedAdapterParams
	extends CreateAdapterParams<EmbedSettings> {}

export interface CreateEmbedAdapterResult extends EmbedAdapter {}
