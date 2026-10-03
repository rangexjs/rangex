import type { RootEditableSnapshot } from "@rangex/core";

export interface GetMediaSourcesParams {
	rootEditableSnapshot: RootEditableSnapshot;
}

export type GetMediaSourcesResult = string[];
