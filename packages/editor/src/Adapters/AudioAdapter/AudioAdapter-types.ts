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

export interface AudioConfigPortProps {
	readonly blockResize: BlockResize;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface AudioConfigPort
	extends AudioConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort,
		CurrentComponentConfigPort<BlockComponent>,
		CommitSnapshotConfigPort,
		SwapToEmptyMediaConfigPort,
		QuickActionsConfigPort {}

export interface AudioPublicPortProps {}

export interface AudioPublicPort
	extends AudioPublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentComponentPublicPort,
		CommitSnapshotPublicPort,
		SwapToEmptyMediaPublicPort,
		QuickActionsPublicPort {}

export interface AudioAdapter {
	configPort: AudioConfigPort;
	publicPort: AudioPublicPort;
}

export interface AudioSettings {}

export interface CreateAudioAdapterParams
	extends CreateAdapterParams<AudioSettings> {}

export interface CreateAudioAdapterResult extends AudioAdapter {}
