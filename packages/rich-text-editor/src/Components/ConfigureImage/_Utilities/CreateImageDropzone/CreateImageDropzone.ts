import { createDetachedContext, createHTMLLayout } from "rich-text-area";
import {
	dataPartName,
	imageDragActiveAttr,
	imagePart,
} from "../../../../Constants";
import { fileImage } from "../../../../SVGs";
import { createUploadSVG } from "../../../_Utilities";
import type { CreateImageDropzoneResult } from "./CreateImageDropzone-types";

/**
 * Static, non-editable instructional chrome (icon + copy). Built with raw DOM APIs since
 * `DetachedContext`'s shadow tree is schema-free — none of this is document content.
 */
const createDropzoneContent = (): Element => {
	const wrapper = document.createElement("div");
	wrapper.style.display = "flex";
	wrapper.style.flexDirection = "column";
	wrapper.style.alignItems = "center";
	wrapper.style.gap = "8px";

	const cta = document.createElement("span");
	cta.style.textDecoration = "underline";
	cta.append(document.createTextNode("Click to upload"));

	const line = document.createElement("p");
	line.style.margin = "0";
	line.append(cta, document.createTextNode(" or drag and drop"));

	const subtext = document.createElement("p");
	subtext.style.margin = "0";
	subtext.style.opacity = "0.75";
	subtext.append(document.createTextNode("Images up to 5MB"));

	wrapper.append(createUploadSVG({ svgMarkup: fileImage }), line, subtext);

	return wrapper;
};

/**
 * The empty-state placeholder shown before an image has a source. Structurally replaces
 * the `img` while empty — removed and swapped for the real `img` once a source is provided.
 */
export const createImageDropzone = (): CreateImageDropzoneResult => {
	return createHTMLLayout({
		localName: "div",
		domAttrs: {
			[dataPartName]: imagePart.dropzone.name,
			[imageDragActiveAttr.name]: imageDragActiveAttr.value.false,
		},
		childNodes: [
			createDetachedContext({
				localName: "div",
				shadowTree: [createDropzoneContent()],
			}),
		],
	});
};
