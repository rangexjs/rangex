import { createSnapshotView } from "rich-text-area";
import { assertNever } from "#utilities";
import { buildViewStyleText } from "../../Styles";
import type {
	CreateElementParams,
	CreateHTMLTreeParams,
	CreateHTMLTreeResult,
	CreateHTMLViewParams,
	CreateHTMLViewResult,
	CreateTextParams,
	Storage,
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
	storage,
	elementView,
	childNodes,
}: CreateElementParams) => {
	const { customStorage, localName, attributes } = elementView;

	const id = createId();
	storage[id] = customStorage;

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
	storage,
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
			.map((childView) => createHTMLTree({ storage, nodeView: childView }))
			.join("");

		return createElement({ storage, elementView: nodeView, childNodes });
	}

	return assertNever(nodeView);
};

/*
 * Converts a stored snapshot into an HTML string plus the styles it needs, without touching the DOM so it can
 * run on the server.
 */
export const createHTMLView = ({
	storedSnapshot,
	styles,
}: CreateHTMLViewParams): CreateHTMLViewResult => {
	const { snapshotView } = createSnapshotView({ storedSnapshot });

	const storage: Storage = {};
	const html = createHTMLTree({ storage, nodeView: snapshotView.tree });

	const viewStyleText = buildViewStyleText(styles);
	const viewStyles = snapshotView.styles + viewStyleText;

	return { styles: viewStyles, html, storage };
};
