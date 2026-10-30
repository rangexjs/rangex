import type { BlockComponent, EditorAPI } from "@rangex/core";
import type { AdapterBus, MediaResolveDetail } from "#adapters";
import type { EmptyMediaConfigPort } from "#adapters/EmptyMedia";
import type {
	AudioAttrsMismatch,
	EmbedAttrsMismatch,
	ImageAttrsMismatch,
	VideoAttrsMismatch,
} from "#dom-attrs";

export interface WatchEmptyMediaParams {
	adapterBus: AdapterBus;
	configPort: EmptyMediaConfigPort;
	editorAPI: EditorAPI;
}

export type WatchEmptyMediaResult = () => void;

export interface ValidateMediaPlacementParams {
	adapterBus: AdapterBus;
	detail: MediaResolveDetail;
}

export type ValidateMediaPlacementResult =
	| ImageAttrsMismatch
	| VideoAttrsMismatch
	| AudioAttrsMismatch
	| EmbedAttrsMismatch
	| null;

export interface FinalizeResolveParams {
	blockComponent: BlockComponent;
	detail: MediaResolveDetail;
}
