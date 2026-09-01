import type { BlockComponent, EditorAPI } from "rich-text-area";
import type {
	EmptyMediaConfigPort,
	MediaResolveDetail,
} from "#adapters/EmptyMedia";

export interface WatchEmptyMediaParams {
	configPort: EmptyMediaConfigPort;
	editorAPI: EditorAPI;
}

export type WatchEmptyMediaResult = () => void;

export interface ResolveMediaSrcParams {
	detail: Exclude<MediaResolveDetail, { type: "embed" }>;
	element: HTMLElement;
	configPort: EmptyMediaConfigPort;
	isStillCurrent: () => boolean;
}

export type ResolveMediaSrcResult = Promise<string | null>;

export interface FinalizeResolveParams {
	blockComponent: BlockComponent;
	type: MediaResolveDetail["type"];
	src: string;
}
