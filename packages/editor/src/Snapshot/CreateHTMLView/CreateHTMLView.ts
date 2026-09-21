import { createSnapshotView } from "rich-text-area";
import { assertNever } from "#utilities";
import type {
	CreateElementParams,
	CreateHTMLTreeParams,
	CreateHTMLTreeResult,
	CreateHTMLViewParams,
	CreateHTMLViewResult,
	CreateTextParams,
	StorageMap,
} from "./CreateHTMLView-types";

export const storageId = "data-storage-id";

const selfClosing = new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"source",
	"track",
	"wbr",
]);

const generateId = () => {
	let i = 0;

	return () => {
		return `${i++}`;
	};
};

const createId = generateId();

const escapeText = (text: string) => {
	return text
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
};

const escapeAttribute = (value: string) => {
	return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
};

const createText = ({ textView }: CreateTextParams) => {
	const { data } = textView;

	return escapeText(data);
};

const createElement = ({
	storageMap,
	elementView,
	childNodes,
}: CreateElementParams) => {
	const { customStorage, localName, attributes } = elementView;

	const id = createId();
	storageMap[id] = customStorage;

	const attrs = { ...attributes, [storageId]: id };

	const attrsList = Object.entries(attrs).map(
		([name, value]) => ` ${name}="${escapeAttribute(String(value))}"`,
	);

	const attrText = attrsList.join("");

	if (selfClosing.has(localName)) {
		return `<${localName}${attrText} />`;
	}

	return `<${localName}${attrText}>${childNodes}</${localName}>`;
};

const createHTMLTree = ({
	storageMap,
	nodeView,
}: CreateHTMLTreeParams): CreateHTMLTreeResult => {
	if (nodeView.type === "text") {
		return createText({ textView: nodeView });
	}

	if (nodeView.type === "comment") {
		return "";
	}

	if (nodeView.type === "element") {
		const childNodes = nodeView.childNodes
			.map((childView) => createHTMLTree({ storageMap, nodeView: childView }))
			.join("");

		return createElement({ storageMap, elementView: nodeView, childNodes });
	}

	return assertNever(nodeView);
};

/*
 * Converts a stored snapshot into an HTML string tree plus the styles it needs, without touching the DOM so it can
 * run on the server.
 */
export const createHTMLView = ({
	storedSnapshot,
}: CreateHTMLViewParams): CreateHTMLViewResult => {
	const { snapshotView } = createSnapshotView({ storedSnapshot });

	const storageMap: StorageMap = {};
	const tree = createHTMLTree({ storageMap, nodeView: snapshotView.tree });

	return { styles: snapshotView.styles, tree, storageMap };
};
