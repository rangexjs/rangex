import { inlineComponentName, isEditorNode } from "rich-text-area";
import { componentsName } from "#engine-links";
import { getStateFromLink } from "../_Utilities";
import type {
	HandleLinkClickParams,
	OpenLinkOverlayParams,
} from "./HandleLinkClick-types";

/**
 * Opens the popover in preview mode, anchored to the clicked link.
 */
const openLinkOverlay = ({
	configPort,
	editorAPI,
	internals,
	link,
	popoverController,
}: OpenLinkOverlayParams) => {
	internals.currentLink = link;

	const state = getStateFromLink({ link, editorAPI });

	configPort.updateState({ view: "preview", mode: "modify", ...state });

	popoverController.show(link, {
		clear: true,
		position: "fixed",
		margin: "8px 0px 0px 0px",
		"position-area": "center bottom",
	});
};

/**
 * Registers a delegated click handler that opens the preview popover whenever the user clicks
 * an existing link.
 */
export const handleLinkClick = ({
	configPort,
	editorAPI,
	internals,
	popoverController,
}: HandleLinkClickParams) => {
	const unsubscribe = editorAPI.registerDOMEvent({
		when: ({ element }) =>
			element.$$editorRole === inlineComponentName &&
			element.$$componentName === componentsName.link,
		eventListener: {
			type: "click",
			listener(event) {
				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (currentTarget.$$editorRole !== inlineComponentName) {
					throw new Error("CurrentTarget's type is invalid.");
				}

				openLinkOverlay({
					configPort,
					editorAPI,
					internals,
					link: currentTarget,
					popoverController,
				});
			},
		},
	});

	return () => {
		unsubscribe();
	};
};
