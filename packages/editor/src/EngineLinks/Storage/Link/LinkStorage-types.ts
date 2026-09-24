import type { InlineComponent } from "rich-text-area";
import type { LinkId } from "../../Constants";
import type { storageVersion } from "../_Utilities";

export interface LinkStorage {
	id: LinkId;
	version: typeof storageVersion;
}

export interface CreateLinkStorageResult extends LinkStorage {}

export interface EnsureLinkStorageParams {
	storage: unknown;
}

export interface EnsureLinkStorageResult extends LinkStorage {}

export interface EnsureNodeLinkStorageParams {
	inlineComponent: InlineComponent;
}

export interface EnsureNodeLinkStorageResult extends LinkStorage {}
