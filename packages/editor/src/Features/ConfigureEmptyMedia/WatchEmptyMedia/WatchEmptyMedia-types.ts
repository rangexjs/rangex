import type { BlockComponent, EditorAPI } from "@rangex/core";
import type { AdapterBus, MediaResolveCallbackParams } from "#adapters";
import type {
	EmptyMediaConfigPort,
	MediaResolveDetail,
} from "#adapters/EmptyMedia";

export interface WatchEmptyMediaParams {
	adapterBus: AdapterBus;
	configPort: EmptyMediaConfigPort;
	editorAPI: EditorAPI;
}

export type WatchEmptyMediaResult = () => void;

export interface ResolveMediaSrcParams {
	mediaSrc: string | File;
	element: HTMLDivElement;
	configPort: EmptyMediaConfigPort;
	isStillCurrent: () => boolean;
}

export type ResolveMediaSrcResult = Promise<string | null>;

export interface WithResolvedSrcParams {
	detail: MediaResolveDetail;
	src: string;
}

export interface ValidateMediaAttrsParams {
	adapterBus: AdapterBus;
	params: MediaResolveCallbackParams;
}

export interface FinalizeResolveParams {
	blockComponent: BlockComponent;
	params: MediaResolveCallbackParams;
}
