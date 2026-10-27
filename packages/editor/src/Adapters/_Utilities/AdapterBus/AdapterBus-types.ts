import type {
	AudioAttrValidators,
	EmbedAttrValidators,
	ImageAttrValidators,
	LinkAttrValidators,
	VideoAttrValidators,
} from "#dom-attrs";
import type { mediaTypes } from "./AdapterBus";

export type MediaType = (typeof mediaTypes)[number];

/*
 * The attribute validators of each Adapter whose component has attributes, by Adapter name
 */
export interface AttrValidatorsByAdapter {
	audio: AudioAttrValidators;
	embed: EmbedAttrValidators;
	image: ImageAttrValidators;
	link: LinkAttrValidators;
	video: VideoAttrValidators;
}

export type AttrValidatorsAdapterName = keyof AttrValidatorsByAdapter;

export interface MediaResolveCallbackParams {
	type: MediaType;
	src: string;
}

export type OnMediaResolveCallbackFn = (
	params: MediaResolveCallbackParams,
) => void;

export type OnSwapToEmptyMediaCallbackFn = () => void;
