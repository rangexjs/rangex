import {
	EditorRange,
	editorSelectionChangeEventType,
	inlineComponentName,
	isEditorNode,
} from "rich-text-area";
import { componentsName, getClosestInlineComponent } from "#engine-links";
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
 * Registers a delegated click handler that tracks the clicked link as the current component
 * and opens the link menu when configured to open on click.
 */
const registerClick = ({
	configPort,
	editorAPI,
	linkMenuPopoverController,
}: RegisterClickParams) => {
	const selection = editorAPI.getEditorSelection();

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

				const selBoundaryPoints = selection.getBoundaryPoints();

				const range = new EditorRange({
					fromNode: selBoundaryPoints.fromText,
					fromOffset: selBoundaryPoints.fromOffset,
					toNode: selBoundaryPoints.toText,
					toOffset: selBoundaryPoints.toOffset,
				});

				const withinSelection = range.isDescendant({
					container: currentTarget,
					start: true,
					end: true,
				});

				if (!withinSelection) {
					return;
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

	const selection = editorAPI.getEditorSelection();

	const unsubscribe = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const selBoundaryPoints = selection.getBoundaryPoints();

			const range = new EditorRange({
				fromNode: selBoundaryPoints.fromText,
				fromOffset: selBoundaryPoints.fromOffset,
				toNode: selBoundaryPoints.toText,
				toOffset: selBoundaryPoints.toOffset,
			});

			const component = getClosestInlineComponent({
				fromNode: range.startText,
			});

			if (component?.$$componentName !== componentsName.link) {
				configPort.setCurrentComponent(null);
				return;
			}

			const withinSelection = range.isDescendant({
				container: component,
				start: true,
				end: true,
			});

			if (!withinSelection) {
				if (configPort.currentComponent === component) {
					configPort.setCurrentComponent(null);
					const instant = !rootEditable.contains(component);
					linkMenuPopoverController.hide({ instant });
				}

				return;
			}

			configPort.setCurrentComponent(component);
			configPort.emitLinkSelectionIn();

			if (configPort.linkMenu.openAt.includes("selection-in")) {
				openLinkMenu({ linkMenuPopoverController, configPort });
			}
		},
	});

	return () => {
		unsubscribe();
	};
};

/*
 * Tracks link click and selection-in interactions, marking the interacted link as the current
 * component and opening the link menu when configured to do so. Returns a cleanup function.
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
