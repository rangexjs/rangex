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

export interface AudioConfigPortProps {
	readonly blockResize: BlockResize;
	readonly quickActions: QuickActionsConfigPort;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface AudioConfigPort
	extends AudioConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort,
		CurrentComponentConfigPort<BlockComponent>,
		SwapToEmptyMediaConfigPort {}

export interface AudioPublicPortProps {
	readonly quickActions: QuickActionsPublicPort;
}

export interface AudioPublicPort
	extends AudioPublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentComponentPublicPort,
		SwapToEmptyMediaPublicPort {}

export interface AudioAdapter {
	configPort: AudioConfigPort;
	publicPort: AudioPublicPort;
}

export interface AudioSettings {}

export interface CreateAudioAdapterParams
	extends CreateAdapterParams<AudioSettings> {}

export interface CreateAudioAdapterResult extends AudioAdapter {}
