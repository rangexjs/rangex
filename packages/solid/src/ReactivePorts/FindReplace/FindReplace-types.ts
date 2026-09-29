import type { FindReplaceSearchResult } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveFindReplacePort {
	currentIndex: Accessor<number>;
	results: Accessor<FindReplaceSearchResult[]>;
}
