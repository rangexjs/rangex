import type { EditorAPI } from "@rangex/core";
import type { AdapterBus } from "#adapters";

export interface LinkMarkdownMatch {
	type: "link";
	fullLength: number;
	text: string;
	url: string;
}

export interface MediaMarkdownMatch {
	type: "media";
	fullLength: number;
	alt: string;
	url: string;
}

export type LinkMarkdownTrigger = LinkMarkdownMatch | MediaMarkdownMatch;

export type MatchLinkTriggerResult = LinkMarkdownTrigger | null;

export interface CanApplyLinkParams {
	adapterBus: AdapterBus;
	editorAPI: EditorAPI;
}

export interface HandleLinkMarkdownParams {
	adapterBus: AdapterBus;
	editorAPI: EditorAPI;
}
