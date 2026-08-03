import { toUILanguage, toUITheme } from "#libs";
import { componentsName } from "#ports";
import {
	codeBlockStorageFallbacks,
	ensureNodeCodeBlockStorage,
} from "../../../Storage";
import type { HandleCodeBlockPopoverAppearanceParams } from "./HandleCodeBlockPopoverAppearance-types";

/**
 * Registers the code block popover with {@link OverlayAppearanceHandler}, pushing the
 * block's current language/theme into the popover just before it appears. Returns the
 * registration's `getCurrentBlock`, threaded to {@link handleCodeBlockPopoverState}.
 */
export const handleCodeBlockPopoverAppearance = ({
	editorPort,
	overlayAppearanceHandler,
}: HandleCodeBlockPopoverAppearanceParams) => {
	return overlayAppearanceHandler.registerComponent({
		popover: editorPort.popover.element,
		position: {
			margin: "4px",
			positionArea: "top right",
			top: "100%",
			right: "100%",
		},
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

			editorPort.popover.element.hidePopover();
			editorPort.popover.element.showPopover({ source: blockComponent });
		},
		onClose() {
			editorPort.popover.element.hidePopover();
		},
	});
};
