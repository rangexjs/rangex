import {
	contentLineRole,
	contentLineRoleSelector,
	createContentLine,
	type InlineComponent,
} from "@rangex/core";
import { normalizeLinkAttrs } from "#dom-attrs";
import { assertNever } from "#utilities";
import { createLink, validateLinkPlacement } from "../../_Utilities";
import { getLinkPlacementMode } from "../_Utilities";
import type {
	AnchorToLinkParams,
	HandleLinkInsertionParams,
	InsertAtCaretParams,
	SetSelectionToLinkEndParams,
	WrapWithLinkParams,
} from "./HandleLinkInsertion-types";

/*
 * Collapses the selection to the end of the link's content so the caret lands inside it.
 */
const setSelectionToLinkEnd = ({
	link,
	selection,
}: SetSelectionToLinkEndParams) => {
	const contentLine = link.$$querySelector(contentLineRoleSelector);

	if (contentLine?.$$editorRole !== contentLineRole) {
		throw new Error("ContentLine's type is invalid.");
	}

	selection.setBoundaryPoints({
		fromNode: contentLine,
		fromOffset: contentLine.$$childNodes.length,
		toNode: contentLine,
		toOffset: contentLine.$$childNodes.length,
	});
};

const anchorToLink = ({
	link,
	linkMenuPopoverController,
}: AnchorToLinkParams) => {
	linkMenuPopoverController.show(link, {
		clear: true,
		position: "fixed",
		"justify-self": "anchor-center",
		top: "calc(anchor(bottom) + 8px)",
	});
};

/*
 * Creates a link at the collapsed caret, inserts it, then anchors the preview popover to it.
 */
const insertAtCaret = ({
	configPort,
	editorAPI,
	text,
	attrs,
	linkMenuPopoverController,
}: InsertAtCaretParams) => {
	const link = createLink({ text, attrs });

	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset } = selection.getBoundaryPoints();

	editorAPI.insertNode({
		fromNode: fromText,
		fromOffset,
		lines: [createContentLine({ localName: "p", childNodes: [link] })],
		breakBeforeInsert: false,
	});

	setSelectionToLinkEnd({ link, selection });
	configPort.updateCurrentComponent({ selectionComponent: link });

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	snapshotTimeline.registerSnapshotBoundary();

	if (configPort.linkMenuSettings.openAt.includes("after-insertion")) {
		anchorToLink({ link, linkMenuPopoverController });
	}

	editorAPI.focus();
};

/*
 * Wraps each of the given wrappable segments with a link.
 */
const wrapWithLink = ({
	configPort,
	editorAPI,
	segments,
	attrs,
	linkMenuPopoverController,
}: WrapWithLinkParams) => {
	const selection = editorAPI.getEditorSelection();

	let currentLink: InlineComponent | null = null;

	for (const segment of segments) {
		const { startText, startOffset, endText, endOffset } =
			segment.getBoundaryPoints();

		const plainText = editorAPI.getPlainText({
			fromNode: startText,
			fromOffset: startOffset,
			toNode: endText,
			toOffset: endOffset,
		});

		const link = createLink({ text: plainText, attrs });

		currentLink = link;

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

	if (!currentLink) {
		throw new Error("CurrentLink not supposed to be null.");
	}

	setSelectionToLinkEnd({ link: currentLink, selection });
	configPort.updateCurrentComponent({ selectionComponent: currentLink });

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	snapshotTimeline.registerSnapshotBoundary();

	if (configPort.linkMenuSettings.openAt.includes("after-insertion")) {
		anchorToLink({ link: currentLink, linkMenuPopoverController });
	}

	editorAPI.focus();
};

/*
 * Handles link insertion requests, creating and inserting a link at the caret or wrapping the
 * current selection depending on the placement mode. Returns a cleanup function.
 */
export const handleLinkInsertion = ({
	configPort,
	editorAPI,
	linkMenuPopoverController,
}: HandleLinkInsertionParams) => {
	const unsubscribe = configPort.onInsert(({ displayText, attrs }) => {
		if (configPort.currentComponent) {
			console.warn("handleLinkInsertion: link is not supposed to be active.");
			return;
		}

		const mode = getLinkPlacementMode({ editorAPI });

		if (mode === null) {
			console.warn("handleLinkInsertion: selection can't take a link.");
			return;
		}

		const placementMismatch = validateLinkPlacement({
			attrValidators: configPort.attrValidators,
			attrs,
		});

		if (placementMismatch) {
			console.warn(placementMismatch);
			return;
		}

		const normalizedAttrs = normalizeLinkAttrs(attrs);

		if (mode.type === "insert") {
			insertAtCaret({
				configPort,
				editorAPI,
				text: displayText || normalizedAttrs.anchor.href,
				attrs: normalizedAttrs,
				linkMenuPopoverController,
			});
			return;
		}

		if (mode.type === "wrap") {
			wrapWithLink({
				configPort,
				editorAPI,
				segments: mode.segments,
				attrs: normalizedAttrs,
				linkMenuPopoverController,
			});
			return;
		}

		assertNever(mode);
	});

	return () => {
		unsubscribe();
	};
};
