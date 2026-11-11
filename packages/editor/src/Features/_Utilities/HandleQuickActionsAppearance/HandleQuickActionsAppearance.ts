import {
	createAnchoredOverlayController,
	createOverlayAppearanceHandler,
} from "#engine-links";
import type { HandleQuickActionsAppearanceParams } from "./HandleQuickActionsAppearance-types";

const defaultAnchorStyle = {
	top: "calc(anchor(top) + 4px)",
	right: "calc(anchor(right) + 4px)",
};

/*
 * Wires a block component's quick-actions overlay appearance to the engine, anchoring it to
 * the hovered block (by `anchorStyle`) and tracking that block as the port's hover component while open.
 * Returns a cleanup function.
 */
export const handleQuickActionsAppearance = ({
	port,
	quickActionsPort,
	editorAPI,
	componentName,
	anchorStyle = defaultAnchorStyle,
}: HandleQuickActionsAppearanceParams) => {
	const overlayAppearanceHandler = createOverlayAppearanceHandler({
		editorAPI,
	});

	const anchorController = createAnchoredOverlayController({
		element: quickActionsPort.element,
		options: {
			lightDismiss: false,
			closeOnEscape: false,
			onToggle: (isOpen) => quickActionsPort.updateQuickActions({ isOpen }),
		},
	});

	const { cleanup: registrationCleanup } =
		overlayAppearanceHandler.registerComponent({
			popover: anchorController.element,
			shouldShow({ blockComponent }) {
				return blockComponent.$$name === componentName;
			},
			onShow({ blockComponent }) {
				anchorController.hide({});

				port.updateCurrentComponent({ hoverComponent: blockComponent });

				anchorController.show(blockComponent, {
					clear: true,
					position: "absolute",
					...anchorStyle,
				});
			},
			onClose() {
				anchorController.hide({});

				port.updateCurrentComponent({ hoverComponent: null });
			},
		});

	return () => {
		overlayAppearanceHandler.cleanup();
		registrationCleanup();
		anchorController.cleanup();
	};
};
