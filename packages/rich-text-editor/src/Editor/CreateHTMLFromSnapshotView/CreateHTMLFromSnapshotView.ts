import type { EditorNodeView } from "rich-text-area";
import {
	basicTextName,
	beamTextName,
	blockComponentLineName,
	blockComponentName,
	blockComponentTextHolderName,
	blockComponentTextName,
	contentLineName,
	detachedContextName,
	glyphFormatterName,
	htmlLayoutName,
	inlineComponentName,
	inlineComponentTextName,
	listItemName,
	listName,
	mathMLLayoutName,
	nestedEditableName,
	oneVisualUnitTextName,
	rootEditableName,
	svgLayoutName,
	tableCellName,
	tableColGroupName,
	tableColName,
	tableName,
	tableRowName,
	tableSectionName,
} from "rich-text-area";
import { assertNever } from "#ports";
import { getStyleSheetText } from "../Styles";
import type {
	CreateHTMLFromSnapshotViewParams,
	CreateHTMLFromSnapshotViewResult,
	PendingTasks,
	StorageMap,
	ToDOMResult,
} from "./CreateHTMLFromSnapshotView-types";
import {
	createBasicTextHTML,
	createBeamTextHTML,
	createBlockComponentHTML,
	createBlockComponentLineHTML,
	createBlockComponentTextHolderHTML,
	createBlockComponentTextHTML,
	createContentLineHTML,
	createDetachedContextHTML,
	createGlyphFormatterHTML,
	createHTMLLayoutHTML,
	createInlineComponentHTML,
	createInlineComponentTextHTML,
	createListHTML,
	createListItemHTML,
	createMathMLLayoutHTML,
	createNestedEditableHTML,
	createOneVisualUnitTextHTML,
	createRootEditableHTML,
	createSVGLayoutHTML,
	createTableCellHTML,
	createTableColGroupHTML,
	createTableColHTML,
	createTableHTML,
	createTableRowHTML,
	createTableSectionHTML,
} from "./CreateNodeHTML";

export const createHTMLFromSnapshotView = ({
	snapshotView,
}: CreateHTMLFromSnapshotViewParams): CreateHTMLFromSnapshotViewResult => {
	const storageMap: StorageMap = new Map();
	const pendingTasks: PendingTasks = [];

	const toDOM = (node: EditorNodeView): ToDOMResult => {
		// Text leaf nodes — no children to process
		if (node.type === beamTextName) {
			return createBeamTextHTML({ beamTextView: node, storageMap });
		}

		if (node.type === basicTextName) {
			return createBasicTextHTML({ basicTextView: node, storageMap });
		}

		if (node.type === oneVisualUnitTextName) {
			return createOneVisualUnitTextHTML({
				oneVisualUnitTextView: node,
				storageMap,
			});
		}

		if (node.type === inlineComponentTextName) {
			return createInlineComponentTextHTML({
				inlineComponentTextView: node,
			});
		}

		if (node.type === blockComponentTextName) {
			return createBlockComponentTextHTML({
				blockComponentTextView: node,
			});
		}

		// Self-contained nodes that manage their own children
		if (node.type === glyphFormatterName) {
			return createGlyphFormatterHTML({
				glyphFormatterView: node,
				toDOM,
				storageMap,
			});
		}

		if (node.type === detachedContextName) {
			return createDetachedContextHTML({
				detachedContextView: node,
				storageMap,
			});
		}

		// Element nodes: resolve children first, then dispatch
		const childNodes = node.childNodes
			.map((child) => toDOM(child))
			.filter((child) => child !== null);

		if (node.type === rootEditableName) {
			return createRootEditableHTML({
				rootEditableView: node,
				childNodes,
				storageMap,
			});
		}

		if (node.type === nestedEditableName) {
			return createNestedEditableHTML({
				nestedEditableView: node,
				childNodes,
				storageMap,
			});
		}

		if (node.type === contentLineName) {
			return createContentLineHTML({
				contentLineView: node,
				childNodes,
				storageMap,
			});
		}

		if (node.type === inlineComponentName) {
			return createInlineComponentHTML({
				inlineComponentView: node,
				childNodes,
				storageMap,
			});
		}

		if (node.type === blockComponentLineName) {
			return createBlockComponentLineHTML({
				blockComponentLineView: node,
				childNodes,
				storageMap,
			});
		}

		if (node.type === blockComponentTextHolderName) {
			return createBlockComponentTextHolderHTML({
				blockComponentTextHolderView: node,
				childNodes,
				storageMap,
			});
		}

		if (node.type === blockComponentName) {
			return createBlockComponentHTML({
				blockComponentView: node,
				childNodes,
				pendingTasks,
				storageMap,
			});
		}

		if (node.type === htmlLayoutName) {
			return createHTMLLayoutHTML({
				htmlLayoutView: node,
				childNodes,
				storageMap,
			});
		}

		if (node.type === svgLayoutName) {
			return createSVGLayoutHTML({
				svgLayoutView: node,
				childNodes,
				storageMap,
			});
		}

		if (node.type === mathMLLayoutName) {
			return createMathMLLayoutHTML({
				mathMLLayoutView: node,
				childNodes,
				storageMap,
			});
		}

		if (node.type === listName) {
			return createListHTML({ listView: node, childNodes, storageMap });
		}

		if (node.type === listItemName) {
			return createListItemHTML({ listItemView: node, childNodes, storageMap });
		}

		if (node.type === tableName) {
			return createTableHTML({ tableView: node, childNodes, storageMap });
		}

		if (node.type === tableSectionName) {
			return createTableSectionHTML({
				tableSectionView: node,
				childNodes,
				storageMap,
			});
		}

		if (node.type === tableRowName) {
			return createTableRowHTML({ tableRowView: node, childNodes, storageMap });
		}

		if (node.type === tableCellName) {
			return createTableCellHTML({
				tableCellView: node,
				childNodes,
				storageMap,
			});
		}

		if (node.type === tableColGroupName) {
			return createTableColGroupHTML({
				tableColGroupView: node,
				childNodes,
				storageMap,
			});
		}

		if (node.type === tableColName) {
			return createTableColHTML({ tableColView: node, childNodes, storageMap });
		}

		return assertNever(node);
	};

	const rootElement = toDOM(snapshotView.tree);

	if (!(rootElement instanceof HTMLElement)) {
		throw new Error("RootEditable must produce an HTMLElement.");
	}

	const styleSheetText = getStyleSheetText({ rxStyle: false });

	const style = document.createElement("style");
	style.textContent = snapshotView.styles + styleSheetText;

	const settled = Promise.allSettled(pendingTasks).then(() => undefined);

	return { style, rootElement, settled };
};
