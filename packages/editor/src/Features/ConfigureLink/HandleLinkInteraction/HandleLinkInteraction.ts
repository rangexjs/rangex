import {
	editorSelectionChangeEventType,
	inlineComponentRole,
	isEditorNode,
} from "@rangex/core";
import { componentsName } from "#engine-links";
import type {
	HandleLinkInteractionParams,
	OpenLinkMenuParams,
	RegisterClickParams,
	RegisterSelectionInParams,
} from "./HandleLinkInteraction-types";

const openLinkMenu = ({
	configPort,
	linkMenuPopoverController,
}: OpenLinkMenuParams) => {
	const { currentComponent } = configPort;

	if (!currentComponent) {
		throw new Error("openLinkMenu: no link is currently open.");
	}

	linkMenuPopoverController.show(currentComponent, {
		clear: true,
		position: "fixed",
		margin: "8px 0px 0px 0px",
		"position-area": "center bottom",
	});
};

/*
 * Registers a delegated click handler that notifies clicks on the current link and opens the link menu
 * when configured to open on click.
 */
const registerClick = ({
	configPort,
	editorAPI,
	linkMenuPopoverController,
}: RegisterClickParams) => {
	const unsubscribe = editorAPI.registerDOMEvent({
		when: ({ element }) =>
			element.$$editorRole === inlineComponentRole &&
			element.$$name === componentsName.link,
		eventListener: {
			type: "click",
			listener(event) {
				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (currentTarget !== configPort.currentComponent) {
					return;
				}

				configPort.notifyLinkClick();

				if (configPort.linkMenuSettings.openAt.includes("click")) {
					openLinkMenu({ linkMenuPopoverController, configPort });
				}
			},
		},
	});

	return () => {
		unsubscribe();
	};
};

/*
 * Notifies selection changes within the current link and opens the link menu when configured to open
 * on selection-in.
 */
const registerSelectionIn = ({
	configPort,
	editorAPI,
	linkMenuPopoverController,
}: RegisterSelectionInParams) => {
	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			if (!configPort.currentComponent) {
				return;
			}

			configPort.notifyLinkSelectionIn();

			if (configPort.linkMenuSettings.openAt.includes("selection-in")) {
				openLinkMenu({ linkMenuPopoverController, configPort });
			}
		},
	});

	return () => {
		unsubscribe();
	};
};

/*
 * Tracks link click and selection-in interactions on the current link, opening the link menu when
 * configured to do so. Expects the current link to be resolved before its selection change fires.
 * Returns a cleanup function.
 */
export const handleLinkInteraction = ({
	configPort,
	editorAPI,
	linkMenuPopoverController,
}: HandleLinkInteractionParams) => {
	const unsubscribeClick = registerClick({
		configPort,
		editorAPI,
		linkMenuPopoverController,
	});

	const unsubscribeSelectionIn = registerSelectionIn({
		configPort,
		editorAPI,
		linkMenuPopoverController,
	});

	return () => {
		unsubscribeClick();
		unsubscribeSelectionIn();
	};
};
