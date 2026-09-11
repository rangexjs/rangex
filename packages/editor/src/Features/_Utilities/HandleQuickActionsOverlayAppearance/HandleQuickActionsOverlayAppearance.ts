import {
	createAnchoredOverlayController,
	createOverlayAppearanceHandler,
} from "#engine-links";
import type { HandleQuickActionsOverlayAppearanceParams } from "./HandleQuickActionsOverlayAppearance-types";

/**
 * Shared hover-panel wiring for every block-component adapter's QuickActions overlay
 * (Image, Video, Audio, Embed, CodeBlock, ...): creates the anchored overlay controller
 * over `port.quickActionsEl`, registers it with a dedicated {@link OverlayAppearanceHandler},
 * and pushes `currentComponent` in/out via `port` on open/close. `beforeOpen` is the only
 * per-feature hook, called between `hide()` and `show()` to push whatever state that
 * feature's overlay needs (alignment, caption, language/theme, ...).
 */
export const handleQuickActionsOverlayAppearance = ({
	port,
	editorAPI,
	componentName,
	beforeOpen,
}: HandleQuickActionsOverlayAppearanceParams) => {
	const overlayAppearanceHandler = createOverlayAppearanceHandler({
		editorAPI,
	});

	const anchorController = createAnchoredOverlayController({
		element: port.quickActionsEl,
		options: {
			onToggle: (open) => port.setQuickActions({ open }),
		},
	});

	const { getCurrentBlock, cleanup: registrationCleanup } =
		overlayAppearanceHandler.registerComponent({
			popover: anchorController.element,
			shouldShow({ blockComponent }) {
				return blockComponent.$$componentName === componentName;
			},
			onShow({ blockComponent }) {
				anchorController.hide();

				port.setCurrentComponent(blockComponent);

				beforeOpen({ blockComponent });

				anchorController.show(blockComponent, {
					clear: true,
					position: "absolute",
					top: "calc(anchor(top) + 4px)",
					right: "calc(anchor(right) + 4px)",
				});
			},
			onClose() {
				anchorController.hide();

				port.setCurrentComponent(null);
			},
		});

	return {
		getCurrentBlock,
		cleanup: () => {
			overlayAppearanceHandler.cleanup();
			registrationCleanup();
		},
	};
};
