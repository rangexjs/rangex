import type { BlockComponent } from "@rangex/core";
import type { EmbedAttrsShape, EmbedAttrValidators } from "#dom-attrs";
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
	SwapToEmptyMediaConfigPort,
	SwapToEmptyMediaPublicPort,
} from "../_Utilities";

export interface EmbedConfigPortProps {
	readonly blockResize: BlockResize;
	readonly attrValidators: EmbedAttrValidators;
	readonly quickActions: QuickActionsConfigPort;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface EmbedConfigPort
	extends EmbedConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort,
		CurrentComponentConfigPort<BlockComponent>,
		DOMAttrsConfigPort<EmbedAttrsShape>,
		SwapToEmptyMediaConfigPort {}

export interface EmbedPublicPortProps {
	readonly quickActions: QuickActionsPublicPort;
}

export interface EmbedPublicPort
	extends EmbedPublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentComponentPublicPort,
		DOMAttrsPublicPort<EmbedAttrsShape>,
		SwapToEmptyMediaPublicPort {}

export interface EmbedAdapter {
	configPort: EmbedConfigPort;
	publicPort: EmbedPublicPort;
}

export interface EmbedSettings {}

export interface CreateEmbedAdapterParams
	extends CreateAdapterParams<EmbedSettings> {}

export interface CreateEmbedAdapterResult extends EmbedAdapter {}
