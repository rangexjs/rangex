import type { BlockComponent } from "@rangex/core";
import type {
	AudioAttrsShape,
	AudioAttrValidators,
	CreateAudioAttrValidatorsParams,
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

export interface AudioConfigPortProps {
	readonly blockResize: BlockResize;
	readonly attrValidators: AudioAttrValidators;
	readonly quickActions: QuickActionsConfigPort;

	onMediaResolve(callback: OnMediaResolveCallbackFn): () => void;
}

export interface AudioConfigPort
	extends AudioConfigPortProps,
		CaptionConfigPort,
		BlockAlignConfigPort,
		CurrentComponentConfigPort<BlockComponent>,
		DOMAttrsConfigPort<AudioAttrsShape>,
		SwapToEmptyMediaConfigPort {}

export interface AudioPublicPortProps {
	readonly quickActions: QuickActionsPublicPort;
}

export interface AudioPublicPort
	extends AudioPublicPortProps,
		CaptionPublicPort,
		BlockAlignPublicPort,
		CurrentComponentPublicPort,
		DOMAttrsPublicPort<AudioAttrsShape>,
		SwapToEmptyMediaPublicPort {}

export interface AudioAdapter {
	configPort: AudioConfigPort;
	publicPort: AudioPublicPort;
}

export interface AudioSettings {
	attrValidators?: CreateAudioAttrValidatorsParams;
}

export interface CreateAudioAdapterParams
	extends CreateAdapterParams<AudioSettings> {}

export interface CreateAudioAdapterResult extends AudioAdapter {}
