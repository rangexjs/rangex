import type { ElementView, NodeView } from "rich-text-area";
import {
	blockComponentAttrName,
	blockComponentLineName,
	blockComponentName,
	mathMLNamespaceURI,
	svgNamespaceURI,
	xhtmlNamespaceURI,
} from "rich-text-area";
import { getStyleSheetText } from "../Styles";
import type {
	AppendShadowRootParams,
	CreateHTMLFromSnapshotViewParams,
	CreateHTMLFromSnapshotViewResult,
	GetChildNamespaceURIParams,
	GetElementNamespaceURIParams,
	PendingTasks,
	StorageMap,
	ToDOMParams,
	ToDOMResult,
} from "./CreateHTMLFromSnapshotView-types";
import {
	resolveBlockComponent,
	shouldSkipBlockComponentLine,
} from "./CreateNodeHTML";
import { setAttributes } from "./CreateNodeHTML/_Utilities";

const { dataComponentName, dataEditorRole } = blockComponentAttrName;

// The HTML parser switches namespace on `svg` / `math` and switches back to
// HTML inside these SVG elements. SnapshotView carries no namespace, so the
// same rules are applied here.
const svgHTMLIntegrationPointLocalNames = ["foreignObject", "desc", "title"];

const getElementNamespaceURI = ({
	parentNamespaceURI,
	localName,
}: GetElementNamespaceURIParams): string => {
	if (localName === "svg") {
		return svgNamespaceURI;
	}

	if (localName === "math") {
		return mathMLNamespaceURI;
	}

	return parentNamespaceURI;
};

const getChildNamespaceURI = ({
	namespaceURI,
	localName,
}: GetChildNamespaceURIParams): string => {
	const isSVGIntegrationPoint =
		namespaceURI === svgNamespaceURI &&
		svgHTMLIntegrationPointLocalNames.includes(localName);

	if (isSVGIntegrationPoint) {
		return xhtmlNamespaceURI;
	}

	return namespaceURI;
};

const isShadowRootTemplate = (node: NodeView): node is ElementView => {
	if (node.type !== "element") {
		return false;
	}

	const { localName, attributes } = node;

	return localName === "template" && attributes.shadowrootmode !== undefined;
};

export const createHTMLFromSnapshotView = ({
	snapshotView,
}: CreateHTMLFromSnapshotViewParams): CreateHTMLFromSnapshotViewResult => {
	const storageMap: StorageMap = new Map();
	const pendingTasks: PendingTasks = [];

	const appendShadowRoot = ({ host, template }: AppendShadowRootParams) => {
		const { shadowrootmode, shadowrootserializable } = template.attributes;

		if (shadowrootmode !== "open" && shadowrootmode !== "closed") {
			throw new Error(`Invalid shadowrootmode: "${shadowrootmode}".`);
		}

		const shadowRoot = host.attachShadow({
			mode: shadowrootmode,
			serializable: shadowrootserializable !== undefined,
		});

		for (const child of template.childNodes) {
			const childNode = toDOM({
				node: child,
				parentNamespaceURI: xhtmlNamespaceURI,
			});

			if (childNode !== null) {
				shadowRoot.append(childNode);
			}
		}
	};

	const toDOM = ({ node, parentNamespaceURI }: ToDOMParams): ToDOMResult => {
		if (node.type === "comment") {
			return null;
		}

		if (node.type === "text") {
			const text = document.createTextNode(node.data);

			storageMap.set(text, node.customStorage);

			return text;
		}

		const { localName, attributes, customStorage, childNodes } = node;

		const namespaceURI = getElementNamespaceURI({
			parentNamespaceURI,
			localName,
		});

		const el = document.createElementNS(namespaceURI, localName);

		setAttributes({ element: el, attributes });

		storageMap.set(el, customStorage);

		const childNamespaceURI = getChildNamespaceURI({ namespaceURI, localName });

		for (const child of childNodes) {
			if (isShadowRootTemplate(child)) {
				appendShadowRoot({ host: el, template: child });

				continue;
			}

			const childNode = toDOM({
				node: child,
				parentNamespaceURI: childNamespaceURI,
			});

			if (childNode !== null) {
				el.append(childNode);
			}
		}

		const editorRole = attributes[dataEditorRole];

		if (editorRole === blockComponentLineName) {
			const shouldSkip = shouldSkipBlockComponentLine({
				blockComponentLineEl: el,
				storageMap,
			});

			if (shouldSkip) {
				return null;
			}
		}

		if (editorRole === blockComponentName) {
			if (!(el instanceof HTMLElement)) {
				throw new Error("BlockComponent must produce an HTMLElement.");
			}

			resolveBlockComponent({
				blockComponentEl: el,
				componentName: attributes[dataComponentName],
				pendingTasks,
				storageMap,
			});
		}

		return el;
	};

	const rootElement = toDOM({
		node: snapshotView.tree,
		parentNamespaceURI: xhtmlNamespaceURI,
	});

	if (!(rootElement instanceof HTMLElement)) {
		throw new Error("RootEditable must produce an HTMLElement.");
	}

	const styleSheetText = getStyleSheetText({ rxStyle: false });

	const style = document.createElement("style");
	style.textContent = snapshotView.styles + styleSheetText;

	const settled = Promise.allSettled(pendingTasks).then(() => undefined);

	return { style, rootElement, settled };
};
