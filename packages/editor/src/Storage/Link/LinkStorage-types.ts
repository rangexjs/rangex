import type { InlineComponent } from "@rangex/core";
import type { LinkId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export type LinkStorage = {
	id: LinkId;
	version: typeof storageVersion;
};

export type CreateLinkStorageResult = LinkStorage;

export interface EnsureLinkStorageParams {
	storage: unknown;
}

export type EnsureLinkStorageResult = LinkStorage;

export interface EnsureNodeLinkStorageParams {
	inlineComponent: InlineComponent;
}

export type EnsureNodeLinkStorageResult = LinkStorage;
