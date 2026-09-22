import type { BlockComponent } from "rich-text-area";
import type {
	BlockAlignConfigPort,
	BlockAlignPublicPort,
	BlockResize,
	CaptionConfigPort,
	CaptionPublicPort,
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
	readonly quickActions: QuickActionsConfigPort;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface VideoConfigPort
	extends VideoConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort,
		CurrentComponentConfigPort<BlockComponent>,
		SwapToEmptyMediaConfigPort {}

export interface VideoPublicPortProps {
	readonly quickActions: QuickActionsPublicPort;
}

export interface VideoPublicPort
	extends VideoPublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentComponentPublicPort,
		SwapToEmptyMediaPublicPort {}

export interface VideoAdapter {
	configPort: VideoConfigPort;
	publicPort: VideoPublicPort;
}

export interface VideoSettings {}

export interface CreateVideoAdapterParams
	extends CreateAdapterParams<VideoSettings> {}

export interface CreateVideoAdapterResult extends VideoAdapter {}
