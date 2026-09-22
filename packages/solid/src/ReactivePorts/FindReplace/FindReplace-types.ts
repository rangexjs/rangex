import type { FindReplaceResultsState } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveFindReplacePort {
	results: Accessor<FindReplaceResultsState>;
}
