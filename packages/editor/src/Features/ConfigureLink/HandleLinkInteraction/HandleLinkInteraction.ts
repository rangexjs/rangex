import {
	inlineComponentAttrName,
	inlineComponentName,
	isEditorNode,
} from "rich-text-area";
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

/**
 * Registers a delegated click handler that tracks the clicked link as the current one and syncs
 * its display text into the popover state.
 */
const registerClick = ({
	configPort,
	editorAPI,
	linkMenuPopoverController,
}: RegisterClickParams) => {
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

				configPort.setCurrentComponent(currentTarget);
				configPort.emitLinkClick();

				if (configPort.linkMenu.openAt.includes("click")) {
					openLinkMenu({ linkMenuPopoverController, configPort });
				}
			},
		},
	});

	return () => {
		unsubscribe();
	};
};

const registerSelectionIn = ({
	configPort,
	editorAPI,
	linkMenuPopoverController,
}: RegisterSelectionInParams) => {
	const { rootEditable } = editorAPI;
	const { dataInteractiveWithinComponentSelection } = inlineComponentAttrName;

	const observer = new MutationObserver((mutations) => {
		for (const { target } of mutations) {
			if (!isEditorNode(target)) {
				throw new Error("Target supposed to be an EditorNode.");
			}

			if (target.$$editorRole !== inlineComponentName) {
				continue;
			}

			if (target.$$componentName !== componentsName.link) {
				continue;
			}

			if (!target.hasAttribute(dataInteractiveWithinComponentSelection)) {
				continue;
			}

			configPort.setCurrentComponent(target);
			configPort.emitLinkSelectionIn();

			if (configPort.linkMenu.openAt.includes("selection-in")) {
				openLinkMenu({ linkMenuPopoverController, configPort });
			}
		}
	});

	observer.observe(rootEditable, {
		attributes: true,
		attributeFilter: [dataInteractiveWithinComponentSelection],
		subtree: true,
	});

	return () => {
		observer.disconnect();
	};
};

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
