import type { InlineComponent } from "@rangex/core";

import type { LinkId } from "../_Constants";

export type LinkStorage = {
	id: LinkId;
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
