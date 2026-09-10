import {
	contentLineName,
	contentLineRoleSelector,
	createContentLine,
} from "rich-text-area";
import { assertNever } from "#utilities";
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
 * Collapses the selection to the end of the link's content so the caret lands inside it.
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

const anchorToLink = ({ link, popoverController }: AnchorToLinkParams) => {
	popoverController.show(link, {
		clear: true,
		position: "fixed",
		"justify-self": "anchor-center",
		top: "calc(anchor(bottom) + 8px)",
	});
};

/**
 * Creates a link at the collapsed caret, inserts it, then anchors the preview popover to it.
 */
const insertAtCaret = ({
	configPort,
	editorAPI,
	internals,
	text,
	href,
	target,
	popoverController,
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

	configPort.updateState(state);

	anchorToLink({ link, popoverController });

	editorAPI.focus();
};

/**
 * Wraps each valid segment in the selection with a link, skipping any that already contain an
 * InlineComponent.
 */
const wrapWithLink = ({
	configPort,
	editorAPI,
	internals,
	href,
	target,
	popoverController,
}: WrapWithLinkParams) => {
	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset, toText, toOffset } =
		selection.getBoundaryPoints();

	const segments = editorAPI.getInlineWrappableSegments({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	for (const segment of segments) {
		if (segment.getInlineComponentListInSegment().length) {
			continue;
		}

		const { startText, startOffset, endText, endOffset } =
			segment.getBoundaryPoints();

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

	configPort.updateState(state);

	anchorToLink({ link: internals.currentLink, popoverController });

	editorAPI.focus();
};

export const handleLinkInsertion = ({
	configPort,
	editorAPI,
	internals,
	popoverController,
}: HandleLinkInsertionParams) => {
	const unsubscribe = configPort.onInsert(({ text, url, isNewTab }) => {
		if (internals.currentLink) {
			console.warn("handleLinkInsertion: a link is already open.");
			return;
		}

		const target = isNewTab ? "_blank" : "_self";

		const mode = getLinkInsertionMode({ editorAPI });

		if (mode === null) {
			console.warn("handleLinkInsertion: selection can't take a link.");
			return;
		}

		if (mode === "insert") {
			insertAtCaret({
				configPort,
				editorAPI,
				internals,
				text: text || url,
				href: url,
				target,
				popoverController,
			});
			return;
		}

		if (mode === "wrap") {
			wrapWithLink({
				configPort,
				editorAPI,
				internals,
				href: url,
				target,
				popoverController,
			});
			return;
		}

		assertNever(mode);
	});

	return () => {
		unsubscribe();
	};
};
