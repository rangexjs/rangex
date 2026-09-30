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

	const [currentIndex, setCurrentIndex] = createSignal(publicPort.currentIndex);
	const [results, setResults] = createSignal(publicPort.results);

	onCleanup(publicPort.onCurrentIndexUpdate(setCurrentIndex));
	onCleanup(publicPort.onResultsUpdate(setResults));

	const port: ReactiveFindReplacePort = {
		currentIndex,
		results,
	};

	return port as PreserveUndefined<T, ReactiveFindReplacePort>;
};
