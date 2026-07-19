import {
	inlineNestedContextAttrName,
	inlineNestedContextName,
	isEditorNode,
} from "rich-text-area";
import { componentsName } from "../../../Constants";
import { getPopoverStateFromLink } from "../_Utilities";
import type {
	HandleLinkClickParams,
	OpenLinkPopoverParams,
} from "./HandleLinkClick-types";

/**
 * Opens the popover in preview mode anchored to the clicked link.
 */
const openLinkPopover = ({
	linkPort,
	editorAPI,
	internals,
	link,
}: OpenLinkPopoverParams) => {
	const { popover } = linkPort;
	popover.hidePopover();

	internals.currentLink = link;

	const popoverState = getPopoverStateFromLink({ link, editorAPI });

	linkPort.updateState({ view: "preview", mode: "modify", ...popoverState });

	popover.style.cssText = "";
	popover.style.marginTop = "8px";
	popover.style.positionArea = "center bottom";

	popover.showPopover({ source: link });
};

/**
 * Registers a delegated click handler that opens the modify popover whenever the user clicks an existing link.
 */
export const handleLinkClick = ({
	linkPort,
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
					linkPort,
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
