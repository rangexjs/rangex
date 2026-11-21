import type { StoredSnapshot } from "@rangex/core";

export interface GetFileSourcesParams {
  storedSnapshot: StoredSnapshot;
}

export type GetFileSourcesResult = string[];
