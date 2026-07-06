import type {
	CreateBeamTextHTMLParams,
	CreateBeamTextHTMLResult,
} from "./CreateBeamTextHTML-types";

export const createBeamTextHTML = ({
	beamTextView,
}: CreateBeamTextHTMLParams): CreateBeamTextHTMLResult => {
	return document.createTextNode(beamTextView.data);
};
