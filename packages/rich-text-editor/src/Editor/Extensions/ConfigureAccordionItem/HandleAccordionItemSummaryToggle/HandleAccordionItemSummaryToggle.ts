import {
	isEditorElement,
	isEditorNode,
	nestedEditableName,
} from "rich-text-area";
import type { HandleAccordionItemSummaryToggleParams } from "./HandleAccordionItemSummaryToggle-types";

/**
 * A click inside the summary's title editable would otherwise toggle the accordion open/closed
 * (native <summary> activation behavior) instead of just placing the caret — canceled here.
 * Enter gets the same treatment: the editor's own newline handling is canceled and swapped for
 * toggling the accordion instead, since <summary>'s own native Enter-to-toggle only fires when
 * <summary> itself is focused, not a NestedEditable inside it.
 */
export const handleAccordionItemSummaryToggle = ({
	editorAPI,
}: HandleAccordionItemSummaryToggleParams) => {
	const unsubscribeClick = editorAPI.registerDOMEvent({
		when: ({ element }) => {
			if (element.$$editorRole !== nestedEditableName) {
				return false;
			}

			const summary = element.$$closest("summary");

			return !!summary;
		},
		eventListener: {
			type: "click",
			listener: (event) => {
				event.preventDefault();
			},
		},
	});

	// TODO: Does not work yet, RootEditable is the EditingHost therefore the keydown won't apply unless we make the NestedEditable an EditingHost
	const unsubscribeKeydown = editorAPI.registerDOMEvent({
		when: ({ element }) => {
			if (element.$$editorRole !== nestedEditableName) {
				return false;
			}

			const summary = element.$$closest("summary");

			return !!summary;
		},
		eventListener: {
			type: "keydown",
			listener: (event) => {
				console.log("fires");
				if (event.code !== "Enter") {
					return;
				}

				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (!isEditorElement(currentTarget)) {
					throw new Error("CurrentTarget must be an EditorElement.");
				}

				const details = currentTarget.$$closest("details");

				if (!(details instanceof HTMLDetailsElement)) {
					throw new Error("Details element wasn't found.");
				}

				event.preventDefault();

				details.open = !details.open;
			},
		},
	});

	return () => {
		unsubscribeClick();
		unsubscribeKeydown();
	};
};
