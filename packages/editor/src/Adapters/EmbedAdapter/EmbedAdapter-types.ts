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

export interface EmbedConfigPortProps {
	readonly blockResize: BlockResize;
	readonly quickActions: QuickActionsConfigPort;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface EmbedConfigPort
	extends EmbedConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort,
		CurrentComponentConfigPort<BlockComponent>,
		SwapToEmptyMediaConfigPort {}

export interface EmbedPublicPortProps {
	readonly quickActions: QuickActionsPublicPort;
}

export interface EmbedPublicPort
	extends EmbedPublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentComponentPublicPort,
		SwapToEmptyMediaPublicPort {}

export interface EmbedAdapter {
	configPort: EmbedConfigPort;
	publicPort: EmbedPublicPort;
}

export interface EmbedSettings {}

export interface CreateEmbedAdapterParams
	extends CreateAdapterParams<EmbedSettings> {}

export interface CreateEmbedAdapterResult extends EmbedAdapter {}
