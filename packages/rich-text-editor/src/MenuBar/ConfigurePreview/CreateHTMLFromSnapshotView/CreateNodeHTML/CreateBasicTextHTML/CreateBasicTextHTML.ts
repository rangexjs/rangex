import type {
	CreateBasicTextHTMLParams,
	CreateBasicTextHTMLResult,
} from "./CreateBasicTextHTML-types";

export const createBasicTextHTML = ({
	basicTextView,
}: CreateBasicTextHTMLParams): CreateBasicTextHTMLResult => {
	return document.createTextNode(basicTextView.data);
};
