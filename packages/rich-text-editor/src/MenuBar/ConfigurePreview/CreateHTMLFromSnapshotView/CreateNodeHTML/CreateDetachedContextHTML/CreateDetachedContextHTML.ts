import type { ElementView, NodeView } from "rich-text-area";
import { setAttributes } from "../_Utilities";
import type {
	CreateDetachedContextHTMLParams,
	CreateDetachedContextHTMLResult,
} from "./CreateDetachedContextHTML-types";

const nodeViewToNode = (nodeView: NodeView): Node | null => {
	if (nodeView.type === "text") {
		return document.createTextNode(nodeView.data);
	}

	if (nodeView.type === "comment") {
		return null;
	}

	return elementViewToElement(nodeView);
};

const elementViewToElement = (elementView: ElementView): Element | null => {
	if (!elementView.namespaceURI) {
		console.warn(
			`[CreateDetachedContextHTML] Skipping element with null namespaceURI: ${elementView.localName}`,
		);
		return null;
	}

	const el = document.createElementNS(
		elementView.namespaceURI,
		elementView.localName,
	);

	setAttributes({ element: el, attributes: elementView.attributes });

	for (const child of elementView.childNodes) {
		const childNode = nodeViewToNode(child);

		if (childNode !== null) {
			el.append(childNode);
		}
	}

	return el;
};

export const createDetachedContextHTML = ({
	detachedContextView,
}: CreateDetachedContextHTMLParams): CreateDetachedContextHTMLResult => {
	const { namespaceURI, localName, attributes } = detachedContextView;

	if (localName === "slot") {
		return null;
	}

	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });

	const shadowRoot = el.attachShadow({ mode: "open", serializable: true });

	for (const child of detachedContextView.childNodes) {
		const childNode = nodeViewToNode(child);

		if (childNode !== null) {
			shadowRoot.append(childNode);
		}
	}

	return el;
};
