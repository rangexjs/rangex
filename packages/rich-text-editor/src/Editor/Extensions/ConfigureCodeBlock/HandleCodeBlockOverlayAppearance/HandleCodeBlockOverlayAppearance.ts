import { toUILanguage, toUITheme } from "#libs";
import { componentsName } from "#ports";
import {
	codeBlockStorageFallbacks,
	ensureNodeCodeBlockStorage,
} from "../../../Storage";
import type { HandleCodeBlockOverlayAppearanceParams } from "./HandleCodeBlockOverlayAppearance-types";

/**
 * Registers the code block overlay with {@link OverlayAppearanceHandler}, pushing the
 * block's current language/theme into the overlay just before it appears. Returns the
 * registration's `getCurrentBlock`, threaded to {@link handleCodeBlockOverlayState}.
 */
export const handleCodeBlockOverlayAppearance = ({
	editorPort,
	overlayAppearanceHandler,
	anchorController,
}: HandleCodeBlockOverlayAppearanceParams) => {
	return overlayAppearanceHandler.registerComponent({
		popover: editorPort.anchoredOverlay.element,
		shouldShow({ blockComponent }) {
			return blockComponent.$$componentName === componentsName.codeBlock;
		},
		onShow({ blockComponent }) {
			const { lang, theme } = ensureNodeCodeBlockStorage({
				blockComponent,
				fallbacks: codeBlockStorageFallbacks,
			});

			editorPort.updateState({
				language: toUILanguage(lang),
				lightTheme: toUITheme(theme.light),
				darkTheme: toUITheme(theme.dark),
			});

			anchorController.show(blockComponent, {
				clear: true,
				position: "absolute",
				top: "calc(anchor(top) - 40px)",
				// right: "calc(anchor(right) + 4px)",
				"justify-self": "center",
			});
		},
		onClose() {
			anchorController.hide();
		},
	});
};
