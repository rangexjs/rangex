import {
	codeBlockStorageFallbacks,
	componentsName,
	ensureNodeCodeBlockStorage,
} from "#engine-links";
import { toUILanguage, toUITheme } from "#libs";
import type { HandleCodeBlockOverlayAppearanceParams } from "./HandleCodeBlockOverlayAppearance-types";

/**
 * Registers the code block overlay with {@link OverlayAppearanceHandler}, pushing the
 * block's current language/theme into the overlay just before it appears. Returns the
 * registration's `getCurrentBlock`, threaded to {@link handleCodeBlockOverlayState}.
 */
export const handleCodeBlockOverlayAppearance = ({
	configPort,
	overlayAppearanceHandler,
	anchorController,
}: HandleCodeBlockOverlayAppearanceParams) => {
	return overlayAppearanceHandler.registerComponent({
		popover: anchorController.element,
		shouldShow({ blockComponent }) {
			return blockComponent.$$componentName === componentsName.codeBlock;
		},
		onShow({ blockComponent }) {
			const { lang, theme } = ensureNodeCodeBlockStorage({
				blockComponent,
				fallbacks: codeBlockStorageFallbacks,
			});

			configPort.updateState({
				language: toUILanguage(lang),
				lightTheme: toUITheme(theme.light),
				darkTheme: toUITheme(theme.dark),
			});

			anchorController.show(blockComponent, {
				clear: true,
				position: "absolute",
				top: "calc(anchor(top) + 4px)",
				right: "calc(anchor(right) + 4px)",
			});
		},
		onClose() {
			anchorController.hide();
		},
	});
};
