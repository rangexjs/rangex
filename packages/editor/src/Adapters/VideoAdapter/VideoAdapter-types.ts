import type { BlockComponent } from "@rangex/core";
import type { VideoAttrsShape, VideoAttrValidators } from "#dom-attrs";
import type {
	BlockAlignConfigPort,
	BlockAlignPublicPort,
	BlockResize,
	CaptionConfigPort,
	CaptionPublicPort,
	CreateAdapterParams,
	CurrentComponentConfigPort,
	CurrentComponentPublicPort,
	DOMAttrsConfigPort,
	DOMAttrsPublicPort,
	OnMediaResolveCallbackFn,
	QuickActionsConfigPort,
	QuickActionsPublicPort,
	SwapToSourcePlaceholderConfigPort,
	SwapToSourcePlaceholderPublicPort,
} from "../_Utilities";

export interface VideoConfigPortProps {
	readonly blockResize: BlockResize;
	readonly attrValidators: VideoAttrValidators;
	readonly quickActions: QuickActionsConfigPort;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface VideoConfigPort
	extends VideoConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort,
		CurrentComponentConfigPort<BlockComponent>,
		DOMAttrsConfigPort<VideoAttrsShape>,
		SwapToSourcePlaceholderConfigPort {}

export interface VideoPublicPortProps {
	readonly quickActions: QuickActionsPublicPort;
}

export interface VideoPublicPort
	extends VideoPublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentComponentPublicPort,
		DOMAttrsPublicPort<VideoAttrsShape>,
		SwapToSourcePlaceholderPublicPort {}

export interface VideoAdapter {
	configPort: VideoConfigPort;
	publicPort: VideoPublicPort;
}

export interface VideoSettings {}

export interface CreateVideoAdapterParams
	extends CreateAdapterParams<VideoSettings> {}

export interface CreateVideoAdapterResult extends VideoAdapter {}
