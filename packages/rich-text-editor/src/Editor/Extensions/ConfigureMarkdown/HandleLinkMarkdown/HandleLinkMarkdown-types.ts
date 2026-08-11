import type { EditorAPI } from "rich-text-area";

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
	editorAPI: EditorAPI;
}

export interface HandleLinkMarkdownParams {
	editorAPI: EditorAPI;
}
