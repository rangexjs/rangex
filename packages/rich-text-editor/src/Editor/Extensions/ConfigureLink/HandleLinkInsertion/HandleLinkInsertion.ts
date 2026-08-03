import {
	contentLineName,
	contentLineRoleSelector,
	createContentLine,
} from "rich-text-area";
import { assertNever } from "#ports";
import { createLink } from "../../_Utilities";
import { getLinkInsertionMode, getStateFromLink } from "../_Utilities";
import type {
	AnchorPopoverToLinkParams,
	HandleLinkInsertionParams,
	InsertAtCaretParams,
	OnInsertCallback,
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
 * Unmounts then re-mounts the popover anchored to the link — required by the Popover API spec
 * when changing the source, and a fresh mount is also the simplest way to guarantee the previous
 * insert-mode instance is gone before the modify-mode one takes its place.
 */
const anchorPopoverToLink = ({
	link,
	editorPort,
}: AnchorPopoverToLinkParams) => {
	editorPort.popover.unmount();
	editorPort.popover.mount();

	const popover = editorPort.popover.element;

	popover.style.cssText = "";
	popover.style.marginTop = "8px";
	popover.style.positionArea = "center bottom";

	popover.showPopover({ source: link });
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

	anchorPopoverToLink({ link, editorPort });

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

	anchorPopoverToLink({ link: internals.currentLink, editorPort });

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
}: HandleLinkInsertionParams) => {
	const callback: OnInsertCallback = ({ text, url, isNewTab }) => {
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
			});
			return;
		}

		if (linkInsertMode === "wrap") {
			wrapWithLink({ editorPort, internals, editorAPI, href: url, target });
			return;
		}

		assertNever(linkInsertMode);
	};

	const unsubscribe = editorPort.onInsert(callback);

	return () => {
		unsubscribe();
	};
};
