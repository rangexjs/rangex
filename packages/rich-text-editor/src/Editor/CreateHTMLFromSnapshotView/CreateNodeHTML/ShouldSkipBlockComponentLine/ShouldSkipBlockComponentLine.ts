import { isEmptyMediaStorage } from "../../../Storage";
import type { ShouldSkipBlockComponentLineParams } from "./ShouldSkipBlockComponentLine-types";

export const shouldSkipBlockComponentLine = ({
	blockComponentLineEl,
	storageMap,
}: ShouldSkipBlockComponentLineParams): boolean => {
	const blockNestedContext = [...blockComponentLineEl.childNodes].at(1);

	if (!blockNestedContext) {
		throw new Error("BlockNestedContext can't be undefined.");
	}

	const storage = storageMap.get(blockNestedContext);

	return isEmptyMediaStorage(storage);
};
