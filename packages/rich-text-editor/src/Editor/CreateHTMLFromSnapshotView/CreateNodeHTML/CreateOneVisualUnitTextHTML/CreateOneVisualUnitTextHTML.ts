import type {
	CreateOneVisualUnitTextHTMLParams,
	CreateOneVisualUnitTextHTMLResult,
} from "./CreateOneVisualUnitTextHTML-types";

export const createOneVisualUnitTextHTML = ({
	oneVisualUnitTextView,
	storageMap,
}: CreateOneVisualUnitTextHTMLParams): CreateOneVisualUnitTextHTMLResult => {
	const { data, customStorage } = oneVisualUnitTextView;
	const text = document.createTextNode(data);

	storageMap.set(text, customStorage);

	return text;
};
