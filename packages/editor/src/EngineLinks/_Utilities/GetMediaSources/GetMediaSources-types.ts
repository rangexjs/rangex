import type { RootEditableSnapshot } from "rich-text-area";

export interface GetMediaSourcesParams {
	rootEditableSnapshot: RootEditableSnapshot;
}

export type GetMediaSourcesResult = string[];
