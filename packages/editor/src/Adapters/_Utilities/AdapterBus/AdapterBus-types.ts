import type {
	AccordionItemAttrValidators,
	AudioAttrs,
	AudioAttrValidators,
	CodeBlockAttrValidators,
	EmbedAttrs,
	EmbedAttrValidators,
	ImageAttrs,
	ImageAttrValidators,
	LinkAttrValidators,
	VideoAttrs,
	VideoAttrValidators,
} from "#dom-attrs";
import type { mediaTypes } from "./AdapterBus";

export type MediaType = (typeof mediaTypes)[number];

/*
 * The attribute validators of each Adapter whose component has attributes, by Adapter name
 */
export interface AttrValidatorsByAdapter {
	accordionItem: AccordionItemAttrValidators;
	audio: AudioAttrValidators;
	codeBlock: CodeBlockAttrValidators;
	embed: EmbedAttrValidators;
	image: ImageAttrValidators;
	link: LinkAttrValidators;
	video: VideoAttrValidators;
}

export type AttrValidatorsAdapterName = keyof AttrValidatorsByAdapter;

/*
 * The resolved media, with every attribute of its component
 */
export type MediaResolveDetail =
	| { type: "image"; attrs: ImageAttrs }
	| { type: "video"; attrs: VideoAttrs }
	| { type: "audio"; attrs: AudioAttrs }
	| { type: "embed"; attrs: EmbedAttrs };

export type OnMediaResolveCallbackFn = (params: MediaResolveDetail) => void;

export type OnSwapToSourcePlaceholderCallbackFn = () => void;
