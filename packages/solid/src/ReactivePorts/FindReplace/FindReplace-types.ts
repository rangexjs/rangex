import type { FindReplaceSearchResult } from "@rangex/editor/find-replace";
import type { Accessor } from "solid-js";

export interface ReactiveFindReplacePort {
	currentIndex: Accessor<number>;
	results: Accessor<FindReplaceSearchResult[]>;
}
