import type { FindReplacePublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveFindReplacePort } from "./FindReplace-types";

export const FindReplace = <T extends FindReplacePublicPort | undefined>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
	}

	const [results, setResults] = createSignal(publicPort.results);

	onCleanup(publicPort.onResultsUpdate(setResults));

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

	return port as FromPublicToReactivePort<T>;
};
