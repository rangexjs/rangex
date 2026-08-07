import type {
	CreateBeamTextHTMLParams,
	CreateBeamTextHTMLResult,
} from "./CreateBeamTextHTML-types";

export const createBeamTextHTML = ({
	beamTextView,
	storageMap,
}: CreateBeamTextHTMLParams): CreateBeamTextHTMLResult => {
	const { data, customStorage } = beamTextView;
	const text = document.createTextNode(data);

	storageMap.set(text, customStorage);

	return text;
};
