import type { adapterIds } from "./AdapterIds";

export type AdapterIds = typeof adapterIds;

export type AdapterId = AdapterIds[keyof AdapterIds];
