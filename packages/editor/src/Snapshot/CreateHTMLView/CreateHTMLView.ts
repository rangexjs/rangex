import { isNodeStorage } from "#storage";
import { assertNever } from "#utilities";
import { buildViewStyleText } from "../../Styles";
import { createSnapshotView } from "../CreateSnapshotView";
import { highlightCodeBlocks } from "../HighlightCodeBlocks";
import type {
	CreateElementParams,
	CreateHTMLTreeParams,
	CreateHTMLTreeResult,
	CreateHTMLViewParams,
	CreateHTMLViewResult,
	CreateIdFn,
	CreateTextParams,
	HTMLViewStorage,
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

const generateId = (): CreateIdFn => {
	let i = 0;

	return () => {
		return `${i++}`;
	};
};

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
	createId,
	elementView,
	childNodes,
}: CreateElementParams) => {
	const { customStorage, localName, attributes } = elementView;

	const attrs = { ...attributes };

	if (isNodeStorage(customStorage)) {
		const id = createId();
		storage[id] = customStorage;
		attrs[storageId] = id;
	}

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
	createId,
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
			.map((childView) =>
				createHTMLTree({ storage, createId, nodeView: childView }),
			)
			.join("");

		return createElement({
			storage,
			createId,
			elementView: nodeView,
			childNodes,
		});
	}

	return assertNever(nodeView);
};

/*
 * Converts a stored snapshot into an HTML string plus the styles it needs, without touching the DOM so it can
 * run on the server. Code blocks are syntax highlighted when `highlightCode` is given.
 */
export const createHTMLView = ({
	storedSnapshot,
	limits,
	styles,
	highlightCode,
}: CreateHTMLViewParams): CreateHTMLViewResult => {
	const { snapshotView } = createSnapshotView({ storedSnapshot, limits });

	if (highlightCode) {
		highlightCodeBlocks({ nodeView: snapshotView.tree, highlightCode });
	}

	const storage: HTMLViewStorage = {};
	const createId = generateId();

	const html = createHTMLTree({
		storage,
		createId,
		nodeView: snapshotView.tree,
	});

	const viewStyleText = buildViewStyleText(styles);
	const viewStyles = snapshotView.styles + viewStyleText;

	return { styles: viewStyles, html, storage };
};
