import {
	contentLineName,
	contentLineRoleSelector,
	createContentLine,
	type InlineComponent,
} from "rich-text-area";
import { assertNever } from "#utilities";
import { createLink } from "../../_Utilities";
import { getLinkPlacementMode } from "../_Utilities";
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

/**
 * Creates a link at the collapsed caret, inserts it, then anchors the preview popover to it.
 */
const insertAtCaret = ({
	configPort,
	editorAPI,
	text,
	linkMenuPopoverController,
	afterInsertion,
}: InsertAtCaretParams) => {
	const link = createLink({ text });

	configPort.setCurrentComponent(link);

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

	afterInsertion?.(link);

	if (configPort.linkMenu.openAt.includes("after-insertion")) {
		anchorToLink({ link, linkMenuPopoverController });
	}

	editorAPI.focus();
};

/**
 * Wraps each valid segment in the selection with a link, skipping any that already contain an
 * InlineComponent.
 */
const wrapWithLink = ({
	configPort,
	editorAPI,
	linkMenuPopoverController,
	afterInsertion,
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

	let currentLink: InlineComponent | null = null;

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

		const link = createLink({ text: plainText });

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

	configPort.setCurrentComponent(currentLink);

	setSelectionToLinkEnd({ link: currentLink, selection });

	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	snapshotTimeline.registerSnapshotBoundary();

	afterInsertion?.(currentLink);

	if (configPort.linkMenu.openAt.includes("after-insertion")) {
		anchorToLink({ link: currentLink, linkMenuPopoverController });
	}

	editorAPI.focus();
};

export const handleLinkInsertion = ({
	configPort,
	editorAPI,
	linkMenuPopoverController,
}: HandleLinkInsertionParams) => {
	const unsubscribe = configPort.onInsert(({ text, afterInsertion }) => {
		if (configPort.currentComponent) {
			console.warn("handleLinkInsertion: a link is already open.");
			return;
		}

		const mode = getLinkPlacementMode({ editorAPI });

		if (mode === null) {
			console.warn("handleLinkInsertion: selection can't take a link.");
			return;
		}

		if (mode === "insert") {
			insertAtCaret({
				configPort,
				editorAPI,
				text,
				linkMenuPopoverController,
				afterInsertion,
			});
			return;
		}

		if (mode === "wrap") {
			wrapWithLink({
				configPort,
				editorAPI,
				linkMenuPopoverController,
				afterInsertion,
			});
			return;
		}

		assertNever(mode);
	});

	return () => {
		unsubscribe();
	};
};
