import type { BlockComponent } from "@rangex/core";
import type {
	CreateImageAttrValidatorsParams,
	ImageAttrsShape,
	ImageAttrValidators,
} from "#dom-attrs";
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

export interface ImageConfigPortProps {
	readonly blockResize: BlockResize;
	readonly attrValidators: ImageAttrValidators;
	readonly quickActions: QuickActionsConfigPort;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface ImageConfigPort
	extends ImageConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort,
		CurrentComponentConfigPort<BlockComponent>,
		DOMAttrsConfigPort<ImageAttrsShape>,
		SwapToEmptyMediaConfigPort {}

export interface ImagePublicPortProps {
	readonly quickActions: QuickActionsPublicPort;
}

export interface ImagePublicPort
	extends ImagePublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentComponentPublicPort,
		DOMAttrsPublicPort<ImageAttrsShape>,
		SwapToEmptyMediaPublicPort {}

export interface ImageAdapter {
	configPort: ImageConfigPort;
	publicPort: ImagePublicPort;
}

export interface ImageSettings {
	attrValidators?: CreateImageAttrValidatorsParams;
}

export interface CreateImageAdapterParams
	extends CreateAdapterParams<ImageSettings> {}

export interface CreateImageAdapterResult extends ImageAdapter {}
