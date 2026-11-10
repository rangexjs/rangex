import {
	blockComponentRole,
	blockComponentRoleSelector,
	type EditorElement,
	type EditorText,
	htmlLayoutRole,
	isEditorElement,
	isEditorNode,
	nestedEditableRoleSelector,
} from "@rangex/core";
import { componentsName } from "#constants";
import type {
	HandleAccordionItemSummaryToggleParams,
	ToggleDetailsParams,
} from "./HandleAccordionItemSummaryToggle-types";

/*
 * Whether the element is the `summary` of an AccordionItem.
 */
const isAccordionItemSummary = (element: EditorElement) => {
	if (element.$$editorRole !== htmlLayoutRole) {
		return false;
	}

	if (element.$$localName !== "summary") {
		return false;
	}

	const blockComponent = element.$$closest(blockComponentRoleSelector);

	if (blockComponent?.$$editorRole !== blockComponentRole) {
		return false;
	}

	return blockComponent.$$name === componentsName.accordionItem;
};

/*
 * Returns the AccordionItem `summary` whose nested editable holds the text, or null if it's in none.
 */
const getTextSummary = (text: EditorText) => {
	const nestedEditable = text.$$parentElement?.$$closest(
		nestedEditableRoleSelector,
	);

	const summary = nestedEditable?.$$parentElement;

	if (!(summary && isAccordionItemSummary(summary))) {
		return null;
	}

	return summary;
};

/*
 * Toggles the open state of the summary's `details`, then registers a snapshot boundary so undo/redo opens/closes it
 * again.
 */
const toggleDetails = ({ editorAPI, summary }: ToggleDetailsParams) => {
	const details = summary.$$closest("details");

	if (!(details instanceof HTMLDetailsElement)) {
		throw new Error("Details element wasn't found.");
	}

	details.open = !details.open;

	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	snapshotTimeline.registerSnapshotBoundary();
};

/*
 * Replaces the native <summary> activation with a manual toggle that registers a snapshot boundary, so the toggle is
 * part of the undo/redo history. Clicks inside the summary's nested editable don't toggle, so it can be edited; Enter
 * toggles when the whole selection is inside it. Returns a cleanup function.
 */
export const handleAccordionItemSummaryToggle = ({
	editorAPI,
}: HandleAccordionItemSummaryToggleParams) => {
	const selection = editorAPI.getEditorSelection();

	const unsubscribeClick = editorAPI.registerDOMEvent({
		when: ({ element }) => isAccordionItemSummary(element),
		eventListener: {
			type: "click",
			listener: (event) => {
				event.preventDefault();

				const { target, currentTarget } = event;

				// Only the summary itself (e.g. its marker), not its nested editable
				if (target !== currentTarget) {
					return;
				}

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (!isEditorElement(currentTarget)) {
					throw new Error("CurrentTarget must be an EditorElement.");
				}

				toggleDetails({ editorAPI, summary: currentTarget });
			},
		},
	});

	// The RootEditable is the editing host, so the keydown can't be listened to on the summary's nested editable
	const unregisterKeydown = editorAPI.registerEventInterceptor({
		type: "keydown",
		interceptor: (event) => {
			if (event.code !== "Enter") {
				return false;
			}

			const { fromText, toText } = selection.getBoundaryPoints();

			const fromSummary = getTextSummary(fromText);

			if (!fromSummary) {
				return false;
			}

			const toSummary = getTextSummary(toText);

			if (fromSummary !== toSummary) {
				return false;
			}

			toggleDetails({ editorAPI, summary: fromSummary });

			return true;
		},
	});

	return () => {
		unsubscribeClick();
		unregisterKeydown();
	};
};
