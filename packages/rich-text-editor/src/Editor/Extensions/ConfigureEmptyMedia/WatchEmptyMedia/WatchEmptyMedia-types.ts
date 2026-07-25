import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { EmptyMediaEditorPort, MediaResolveDetail } from "#adapters";

export interface WatchEmptyMediaParams {
	editorPort: EmptyMediaEditorPort;
	editorAPI: EditorAPI;
}

export type WatchEmptyMediaResult = () => void;

export interface ResolveMediaSrcParams {
	detail: Exclude<MediaResolveDetail, { type: "embed" }>;
	element: HTMLElement;
	editorPort: EmptyMediaEditorPort;
	isStillCurrent: () => boolean;
}

export type ResolveMediaSrcResult = Promise<string | null>;

export interface FinalizeResolveParams {
	blockNestedContext: BlockNestedContext;
	type: MediaResolveDetail["type"];
	src: string;
}
