import type { BlockComponentLine } from "@rangex/core";
import type { AudioAttrs } from "#dom-attrs";

export interface CreateAudioParams {
	attrs: AudioAttrs;
}

export type CreateAudioResult = BlockComponentLine;
