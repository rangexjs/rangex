import type { AudioAttrs, AudioAttrsMismatch, AudioAttrValidators } from "#dom-attrs";

export interface ValidateAudioPlacementParams {
	attrValidators: AudioAttrValidators;
	attrs: AudioAttrs;
}

export type ValidateAudioPlacementResult = AudioAttrsMismatch | null;
