import type { FindReplacePublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type {
	ReactiveFindReplacePort,
	ReactiveFindReplaceResult,
} from "./FindReplace-types";

export const FindReplace = (
	publicPort: FindReplacePublicPort,
): ReactiveFindReplaceResult => {
	const [results, setResults] = createSignal(publicPort.results);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onResultsUpdate(setResults));

	const port: ReactiveFindReplacePort = {
		results,

		open: publicPort.open,
		close: publicPort.close,
		search: publicPort.search,
		stepBack: publicPort.stepBack,
		stepForward: publicPort.stepForward,
		navigateToIndex: publicPort.navigateToIndex,
		replace: publicPort.replace,
		replaceAll: publicPort.replaceAll,
	};

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
