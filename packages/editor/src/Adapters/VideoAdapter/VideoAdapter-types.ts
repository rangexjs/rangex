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

export interface VideoConfigPortProps {
	readonly blockResize: BlockResize;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface VideoConfigPort
	extends VideoConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort,
		CurrentComponentConfigPort<BlockComponent>,
		CommitSnapshotConfigPort,
		SwapToEmptyMediaConfigPort,
		QuickActionsConfigPort {}

export interface VideoPublicPortProps {}

export interface VideoPublicPort
	extends VideoPublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentComponentPublicPort,
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
