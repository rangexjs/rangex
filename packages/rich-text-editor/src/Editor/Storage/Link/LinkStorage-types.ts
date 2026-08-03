import type { InlineComponent } from "rich-text-area";
import type { LinkId } from "../../Constants";
import type { linkStorageVersion } from "./LinkStorage";

export interface LinkStorage {
	id: LinkId;
	version: typeof linkStorageVersion;
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
