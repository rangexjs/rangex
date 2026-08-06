import type {
	CreateBasicTextHTMLParams,
	CreateBasicTextHTMLResult,
} from "./CreateBasicTextHTML-types";

export const createBasicTextHTML = ({
	basicTextView,
	storageMap,
}: CreateBasicTextHTMLParams): CreateBasicTextHTMLResult => {
	const { data, customStorage } = basicTextView;
	const text = document.createTextNode(data);

	storageMap.set(text, customStorage);

	return text;
};
