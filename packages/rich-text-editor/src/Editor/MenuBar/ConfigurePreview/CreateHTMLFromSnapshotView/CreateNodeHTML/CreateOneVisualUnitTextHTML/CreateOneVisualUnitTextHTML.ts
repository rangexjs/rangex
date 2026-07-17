import type {
	CreateOneVisualUnitTextHTMLParams,
	CreateOneVisualUnitTextHTMLResult,
} from "./CreateOneVisualUnitTextHTML-types";

export const createOneVisualUnitTextHTML = ({
	oneVisualUnitTextView,
}: CreateOneVisualUnitTextHTMLParams): CreateOneVisualUnitTextHTMLResult => {
	return document.createTextNode(oneVisualUnitTextView.data);
};
