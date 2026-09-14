import type { FindReplacePublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveFindReplacePort } from "./FindReplace-types";

export const FindReplace = <T extends FindReplacePublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveFindReplacePort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveFindReplacePort>;
	}

	const [results, setResults] = createSignal(publicPort.results);

	onCleanup(publicPort.onResultsUpdate(setResults));

	const port: ReactiveFindReplacePort = {
		results,
	};

	return port as PreserveUndefined<T, ReactiveFindReplacePort>;
};
