import type { BlockComponent, EditorAPI } from "@rangex/core";
import type { AdapterBus, MediaResolveDetail } from "#adapters";
import type { EmptyMediaConfigPort } from "#adapters/EmptyMedia";

export interface WatchEmptyMediaParams {
	adapterBus: AdapterBus;
	configPort: EmptyMediaConfigPort;
	editorAPI: EditorAPI;
}

export type WatchEmptyMediaResult = () => void;

export interface ValidateMediaAttrsParams {
	adapterBus: AdapterBus;
	detail: MediaResolveDetail;
}

export interface FinalizeResolveParams {
	blockComponent: BlockComponent;
	detail: MediaResolveDetail;
}
