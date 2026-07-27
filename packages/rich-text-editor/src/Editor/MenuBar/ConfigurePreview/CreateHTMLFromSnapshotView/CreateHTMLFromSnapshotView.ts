import type { EditorNodeView } from "rich-text-area";
import {
	basicTextName,
	beamTextName,
	blockNestedContextLineName,
	blockNestedContextName,
	blockNestedContextTextHolderName,
	blockNestedContextTextName,
	contentLineName,
	detachedContextName,
	glyphFormatterName,
	htmlLayoutName,
	inlineNestedContextName,
	inlineNestedContextTextName,
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
import { getStyleSheetTexts } from "../../../Styles";
import type {
	CreateHTMLFromSnapshotViewParams,
	CreateHTMLFromSnapshotViewResult,
	PendingTasks,
	ToDOMResult,
} from "./CreateHTMLFromSnapshotView-types";
import {
	createBasicTextHTML,
	createBeamTextHTML,
	createBlockNestedContextHTML,
	createBlockNestedContextLineHTML,
	createBlockNestedContextTextHolderHTML,
	createBlockNestedContextTextHTML,
	createContentLineHTML,
	createDetachedContextHTML,
	createGlyphFormatterHTML,
	createHTMLLayoutHTML,
	createInlineNestedContextHTML,
	createInlineNestedContextTextHTML,
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
	const pendingTasks: PendingTasks = [];

	const toDOM = (node: EditorNodeView): ToDOMResult => {
		// Text leaf nodes — no children to process
		if (node.type === beamTextName) {
			return createBeamTextHTML({ beamTextView: node });
		}

		if (node.type === basicTextName) {
			return createBasicTextHTML({ basicTextView: node });
		}

		if (node.type === oneVisualUnitTextName) {
			return createOneVisualUnitTextHTML({ oneVisualUnitTextView: node });
		}

		if (node.type === inlineNestedContextTextName) {
			return createInlineNestedContextTextHTML({
				inlineNestedContextTextView: node,
			});
		}

		if (node.type === blockNestedContextTextName) {
			return createBlockNestedContextTextHTML({
				blockNestedContextTextView: node,
			});
		}

		// Self-contained nodes that manage their own children
		if (node.type === glyphFormatterName) {
			return createGlyphFormatterHTML({ glyphFormatterView: node, toDOM });
		}

		if (node.type === detachedContextName) {
			return createDetachedContextHTML({ detachedContextView: node });
		}

		// Element nodes: resolve children first, then dispatch
		const childNodes = node.childNodes
			.map((child) => toDOM(child))
			.filter((child) => child !== null);

		if (node.type === rootEditableName) {
			return createRootEditableHTML({ rootEditableView: node, childNodes });
		}

		if (node.type === nestedEditableName) {
			return createNestedEditableHTML({ nestedEditableView: node, childNodes });
		}

		if (node.type === contentLineName) {
			return createContentLineHTML({ contentLineView: node, childNodes });
		}

		if (node.type === inlineNestedContextName) {
			return createInlineNestedContextHTML({
				inlineNestedContextView: node,
				childNodes,
			});
		}

		if (node.type === blockNestedContextLineName) {
			return createBlockNestedContextLineHTML({
				blockNestedContextLineView: node,
				childNodes,
			});
		}

		if (node.type === blockNestedContextTextHolderName) {
			return createBlockNestedContextTextHolderHTML({
				blockNestedContextTextHolderView: node,
				childNodes,
			});
		}

		if (node.type === blockNestedContextName) {
			return createBlockNestedContextHTML({
				blockNestedContextView: node,
				childNodes,
				pendingTasks,
			});
		}

		if (node.type === htmlLayoutName) {
			return createHTMLLayoutHTML({ htmlLayoutView: node, childNodes });
		}

		if (node.type === svgLayoutName) {
			return createSVGLayoutHTML({ svgLayoutView: node, childNodes });
		}

		if (node.type === mathMLLayoutName) {
			return createMathMLLayoutHTML({ mathMLLayoutView: node, childNodes });
		}

		if (node.type === listName) {
			return createListHTML({ listView: node, childNodes });
		}

		if (node.type === listItemName) {
			return createListItemHTML({ listItemView: node, childNodes });
		}

		if (node.type === tableName) {
			return createTableHTML({ tableView: node, childNodes });
		}

		if (node.type === tableSectionName) {
			return createTableSectionHTML({ tableSectionView: node, childNodes });
		}

		if (node.type === tableRowName) {
			return createTableRowHTML({ tableRowView: node, childNodes });
		}

		if (node.type === tableCellName) {
			return createTableCellHTML({ tableCellView: node, childNodes });
		}

		if (node.type === tableColGroupName) {
			return createTableColGroupHTML({ tableColGroupView: node, childNodes });
		}

		if (node.type === tableColName) {
			return createTableColHTML({ tableColView: node, childNodes });
		}

		return assertNever(node);
	};

	const rootElement = toDOM(snapshotView.tree);

	if (!(rootElement instanceof HTMLElement)) {
		throw new Error("RootEditable must produce an HTMLElement.");
	}

	const { contentStyleSheetText } = getStyleSheetTexts();

	const style = document.createElement("style");
	style.textContent = snapshotView.styles + contentStyleSheetText;

	const settled = Promise.allSettled(pendingTasks).then(() => undefined);

	return { style, rootElement, settled };
};
