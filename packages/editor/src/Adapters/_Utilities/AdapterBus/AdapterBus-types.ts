import type { ImageAttrValidators, LinkAttrValidators } from "#dom-attrs";
import type { mediaTypes } from "./AdapterBus";

export type MediaType = (typeof mediaTypes)[number];

/*
 * The attribute validators of each Adapter whose component has attributes, by Adapter name
 */
export interface AttrValidatorsByAdapter {
	image: ImageAttrValidators;
	link: LinkAttrValidators;
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
