import type { HTMLLayout } from "rich-text-area";
import type { aspectRatioAttr } from "../../../../Constants";

export type EmbedAspectRatioValue = keyof typeof aspectRatioAttr.value;

export interface GetEmbedAspectRatioParams {
	iframe: HTMLLayout;
}

export type GetEmbedAspectRatioResult = EmbedAspectRatioValue;

export interface SetEmbedAspectRatioParams {
	iframe: HTMLLayout;
	aspectRatio: EmbedAspectRatioValue;
}
