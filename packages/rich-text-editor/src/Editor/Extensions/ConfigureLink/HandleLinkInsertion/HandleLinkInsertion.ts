import {
	contentLineName,
	contentLineRoleSelector,
	createContentLine,
	createFormattableTexts,
	createHTMLLayout,
	createInlineNestedContext,
	createNestedEditable,
} from "rich-text-area";
import { componentsName } from "../../../Constants";
import { assertNever } from "../../../ErrorHandling";
import { getLinkInsertionMode, getPopoverStateFromLink } from "../_Utilities";
import { createLinkStorage } from "../LinkStorage";
import type {
	AnchorPopoverToLinkParams,
	CreateLinkComponentParams,
	CreateLinkComponentResult,
	HandleLinkInsertionParams,
	InsertAtCaretParams,
	OnInsertCallback,
	SetSelectionToLinkEndParams,
	WrapWithLinkParams,
} from "./HandleLinkInsertion-types";

const createLinkComponent = ({
	text,
	href,
	target,
}: CreateLinkComponentParams): CreateLinkComponentResult => {
	const inlineNestedContext = createInlineNestedContext({
		componentName: componentsName.link,
		content: { type: "linked-characters" },
		customStorage: createLinkStorage(),
		childNodes: [
			createHTMLLayout({
				localName: "a",
				domAttrs: { href, target },
				childNodes: [
					createNestedEditable({
						content: { type: "linked-characters", unwrap: "if-empty" },
						allowedComponents: [],
						display: "inline",
						childNodes: [
							createContentLine({
								localName: "span",
								childNodes: [...createFormattableTexts({ data: text })],
							}),
						],
					}),
				],
			}),
		],
	});

	return inlineNestedContext;
};

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
 * Hides then re-shows the popover anchored to the link — required by the Popover API spec when changing the source.
 */
const anchorPopoverToLink = ({ link, popover }: AnchorPopoverToLinkParams) => {
	popover.hidePopover();

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
	const link = createLinkComponent({ text, href, target });

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

	const popoverState = getPopoverStateFromLink({ editorAPI, link });

	editorPort.updateState(popoverState);

	const { popover } = editorPort;

	anchorPopoverToLink({ link, popover });

	editorAPI.focus();

	return;
};

/**
 * Wraps each valid segment in the selection with a link, skipping any that already contain an InlineNestedContext.
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
		const inlineNestedContextsInSegment =
			inlineWrappableSegment.getInlineNestedContextListInSegment();

		if (inlineNestedContextsInSegment.length) {
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

		const link = createLinkComponent({ text: plainText, href, target });

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

	const popoverState = getPopoverStateFromLink({
		editorAPI,
		link: internals.currentLink,
	});

	editorPort.updateState(popoverState);

	const { popover } = editorPort;

	anchorPopoverToLink({ link: internals.currentLink, popover });

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
