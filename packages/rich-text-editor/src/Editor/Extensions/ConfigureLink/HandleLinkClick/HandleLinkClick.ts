import {
	inlineNestedContextAttrName,
	inlineNestedContextName,
	isEditorNode,
} from "rich-text-area";
import { componentsName } from "../../../Constants";
import { getStateFromLink } from "../_Utilities";
import type {
	HandleLinkClickParams,
	OpenLinkPopoverParams,
} from "./HandleLinkClick-types";

/**
 * Opens the popover in preview mode anchored to the clicked link.
 */
const openLinkPopover = ({
	editorPort,
	editorAPI,
	internals,
	link,
}: OpenLinkPopoverParams) => {
	editorPort.popover.unmount();

	internals.currentLink = link;

	const state = getStateFromLink({ link, editorAPI });

	editorPort.updateState({ view: "preview", mode: "modify", ...state });

	editorPort.popover.mount();

	const popover = editorPort.popover.element;

	popover.style.cssText = "";
	popover.style.marginTop = "8px";
	popover.style.positionArea = "center bottom";

	popover.showPopover({ source: link });
};

/**
 * Registers a delegated click handler that opens the modify popover whenever the user clicks an existing link.
 */
export const handleLinkClick = ({
	editorPort,
	editorAPI,
	internals,
}: HandleLinkClickParams) => {
	const unsubscribe = editorAPI.registerDOMEvent({
		eventListener: {
			type: "click",
			listener(event) {
				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (currentTarget.$$editorRole !== inlineNestedContextName) {
					throw new Error("CurrentTarget's type is invalid.");
				}

				openLinkPopover({
					editorPort,
					editorAPI,
					internals,
					link: currentTarget,
				});
			},
		},

		when({ element }) {
			const { dataComponentName } = inlineNestedContextAttrName;

			const matched = element.matches(
				`[${dataComponentName}="${componentsName.link}"]`,
			);

			return matched;
		},
	});

	return () => {
		unsubscribe();
	};
};
