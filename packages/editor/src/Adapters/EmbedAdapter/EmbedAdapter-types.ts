import type { BlockComponent } from "rich-text-area";
import type {
	BlockAlignConfigPort,
	BlockAlignPublicPort,
	BlockResize,
	CaptionConfigPort,
	CaptionPublicPort,
	CommitSnapshotConfigPort,
	CommitSnapshotPublicPort,
	CreateAdapterParams,
	CurrentComponentConfigPort,
	CurrentComponentPublicPort,
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
		CurrentComponentConfigPort<BlockComponent>,
		CommitSnapshotConfigPort,
		SwapToEmptyMediaConfigPort,
		QuickActionsConfigPort {}

export interface EmbedPublicPortProps {}

export interface EmbedPublicPort
	extends EmbedPublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentComponentPublicPort,
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
