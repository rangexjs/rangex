import { componentsName } from "../../../Constants";
import { toUILanguage, toUITheme } from "../_Utilities";
import {
	codeBlockStorageFallbacks,
	ensureNodeCodeBlockStorage,
} from "../CodeBlockStorage";
import type { HandleCodeBlockPopoverAppearanceParams } from "./HandleCodeBlockPopoverAppearance-types";

/**
 * Registers the code block popover with the shared {@link BlockPopoverAppearanceHandler},
 * pushing the block's current language/theme into the popover just before it appears.
 */
export const handleCodeBlockPopoverAppearance = ({
	richTextEditorUI,
	blockPopoverAppearanceHandler,
}: HandleCodeBlockPopoverAppearanceParams) => {
	const { codeBlockPopover } = richTextEditorUI;

	blockPopoverAppearanceHandler.registerComponent({
		componentName: componentsName.codeBlock,
		popover: codeBlockPopover.popover,
		position: {
			margin: "4px",
			positionArea: "top right",
			top: "100%",
			right: "100%",
		},
		onShow({ blockNestedContext }) {
			const { lang, theme } = ensureNodeCodeBlockStorage({
				blockNestedContext,
				fallbacks: codeBlockStorageFallbacks,
			});

			codeBlockPopover.updateState({
				language: toUILanguage(lang),
				lightTheme: toUITheme(theme.light),
				darkTheme: toUITheme(theme.dark),
			});
		},
	});

	return () => {
		blockPopoverAppearanceHandler.unregisterComponent({
			componentName: componentsName.codeBlock,
		});
	};
};
