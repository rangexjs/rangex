import {
	inlineComponentAttrName,
	inlineComponentName,
	isEditorNode,
} from "rich-text-area";
import { componentsName } from "#ports";
import { getStateFromLink } from "../_Utilities";
import type {
	HandleLinkClickParams,
	OpenLinkOverlayParams,
} from "./HandleLinkClick-types";

/**
 * Opens the popover in preview mode anchored to the clicked link.
 */
const openLinkOverlay = ({
	editorPort,
	editorAPI,
	internals,
	link,
	anchorController,
}: OpenLinkOverlayParams) => {
	internals.currentLink = link;

	const state = getStateFromLink({ link, editorAPI });

	editorPort.updateState({ view: "preview", mode: "modify", ...state });

	anchorController.show(link, {
		clear: true,
		position: "absolute",
		"justify-self": "anchor-center",
		top: "calc(anchor(bottom) + 8px)",
	});
};

/**
 * Registers a delegated click handler that opens the modify popover whenever the user clicks an existing link.
 */
export const handleLinkClick = ({
	editorPort,
	editorAPI,
	internals,
	anchorController,
}: HandleLinkClickParams) => {
	const unsubscribe = editorAPI.registerDOMEvent({
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
					editorPort,
					editorAPI,
					internals,
					link: currentTarget,
					anchorController,
				});
			},
		},

		when({ element }) {
			const { dataComponentName } = inlineComponentAttrName;

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
