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
import type { FileId } from "#storage";

import type { sourceTypes } from "./AdapterBus";

export type SourceType = (typeof sourceTypes)[number];

export type MediaType = Exclude<SourceType, "embed">;

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
 * The resolved source, with every attribute of its component. An image, video or audio also carries its file's id in
 * the app's storage, or null when it isn't an uploaded file.
 */
export type SourceResolveDetail =
  | { type: "image"; attrs: ImageAttrs; fileId: FileId }
  | { type: "video"; attrs: VideoAttrs; fileId: FileId }
  | { type: "audio"; attrs: AudioAttrs; fileId: FileId }
  | { type: "embed"; attrs: EmbedAttrs };

export type OnSourceResolveCallbackFn = (params: SourceResolveDetail) => void;

export type OnSwapToSourcePlaceholderCallbackFn = () => void;
