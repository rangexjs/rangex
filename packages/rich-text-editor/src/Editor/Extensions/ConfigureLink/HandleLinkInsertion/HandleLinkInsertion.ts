import {
	contentLineName,
	contentLineRoleSelector,
	createContentLine,
} from "rich-text-area";
import { assertNever } from "#ports";
import { createLink } from "../../_Utilities";
import { getLinkInsertionMode, getStateFromLink } from "../_Utilities";
import type {
	AnchorToLinkParams,
	HandleLinkInsertionParams,
	InsertAtCaretParams,
	SetSelectionToLinkEndParams,
	WrapWithLinkParams,
} from "./HandleLinkInsertion-types";

/**
 * Collapses the selection to the end of the link's content so the caret lands inside the link after insertion.
 */
const setSelectionToLinkEnd = ({
	link,
	selection,
}: SetSelectionToLinkEndParams) => {
	const contentLine = link.$$querySelector(contentLineRoleSelector);

	if (contentLine?.$$editorRole !== contentLineName) {
		throw new Error("ContentLine's type is invalid.");
	}

	selection.setBoundaryPoints({
		fromNode: contentLine,
		fromOffset: contentLine.$$childNodes.length,
		toNode: contentLine,
		toOffset: contentLine.$$childNodes.length,
	});
};

/**
 * Anchors the popover to the link.
 */
const anchorToLink = ({ link, anchorController }: AnchorToLinkParams) => {
	anchorController.show(link, {
		clear: true,
		position: "absolute",
		"justify-self": "anchor-center",
		top: "calc(anchor(bottom) + 8px)",
	});
};

/**
 * Creates a link at the collapsed caret, inserts it into the editor, then anchors the preview popover to it.
 */
const insertAtCaret = ({
	editorPort,
	editorAPI,
	internals,
	text,
	href,
	target,
	anchorController,
}: InsertAtCaretParams) => {
	const link = createLink({ text, href, target });

	internals.currentLink = link;

	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset } = selection.getBoundaryPoints();

	editorAPI.insertNode({
		fromNode: fromText,
		fromOffset,
		lines: [createContentLine({ localName: "p", childNodes: [link] })],
		breakBeforeInsert: false,
	});

	setSelectionToLinkEnd({ link, selection });

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	snapshotTimeline.registerSnapshotBoundary();

	const state = getStateFromLink({ editorAPI, link });

	editorPort.updateState(state);

	anchorToLink({ link, anchorController });

	editorAPI.focus();

	return;
};

/**
 * Wraps each valid segment in the selection with a link, skipping any that already contain an InlineComponent.
 */
const wrapWithLink = ({
	editorPort,
	editorAPI,
	internals,
	href,
	target,
	anchorController,
}: WrapWithLinkParams) => {
	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset, toText, toOffset } =
		selection.getBoundaryPoints();

	const inlineWrappableSegments = editorAPI.getInlineWrappableSegments({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	for (const inlineWrappableSegment of inlineWrappableSegments) {
		const inlineComponentsInSegment =
			inlineWrappableSegment.getInlineComponentListInSegment();

		if (inlineComponentsInSegment.length) {
			continue;
		}

		const { startText, startOffset, endText, endOffset } =
			inlineWrappableSegment.getBoundaryPoints();

		const plainText = editorAPI.getPlainText({
			fromNode: startText,
			fromOffset: startOffset,
			toNode: endText,
			toOffset: endOffset,
		});

		const link = createLink({ text: plainText, href, target });

		internals.currentLink = link;

		editorAPI.removeNodesInRange({
			fromNode: startText,
			fromOffset: startOffset,
			toNode: endText,
			toOffset: endOffset,
		});

		const updatedBoundaryPoints = selection.getBoundaryPoints();

		editorAPI.insertNode({
			fromNode: updatedBoundaryPoints.fromText,
			fromOffset: updatedBoundaryPoints.fromOffset,
			lines: [createContentLine({ localName: "p", childNodes: [link] })],
			breakBeforeInsert: false,
		});
	}

	if (!internals.currentLink) {
		throw new Error("CurrentLink not supposed to be null.");
	}

	setSelectionToLinkEnd({ link: internals.currentLink, selection });

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	snapshotTimeline.registerSnapshotBoundary();

	const state = getStateFromLink({
		editorAPI,
		link: internals.currentLink,
	});

	editorPort.updateState(state);

	anchorToLink({ link: internals.currentLink, anchorController });

	editorAPI.focus();

	return;
};

/**
 * Registers the insert callback and delegates to insertAtCaret or wrapWithLink based on the current insertion mode.
 */
export const handleLinkInsertion = ({
	editorPort,
	editorAPI,
	internals,
	anchorController,
}: HandleLinkInsertionParams) => {
	const unsubscribe = editorPort.onInsert(({ text, url, isNewTab }) => {
		if (internals.currentLink) {
			console.log("Link should have been unsigned.");
			return;
		}

		const target = isNewTab ? "_blank" : "_self";

		const linkInsertMode = getLinkInsertionMode({ editorAPI });

		if (linkInsertMode === null) {
			console.warn("Insertion is not allowed.");
			return;
		}

		if (linkInsertMode === "insert") {
			const filledText = text || url;
			insertAtCaret({
				editorPort,
				editorAPI,
				internals,
				text: filledText,
				href: url,
				target,
				anchorController,
			});
			return;
		}

		if (linkInsertMode === "wrap") {
			wrapWithLink({
				editorPort,
				internals,
				editorAPI,
				href: url,
				target,
				anchorController,
			});
			return;
		}

		assertNever(linkInsertMode);
	});

	return () => {
		unsubscribe();
	};
};
