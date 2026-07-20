import { FormattingAdapter } from "#adapters";
import { configureFormatting } from "#editor-extensions";
import { extensionsName, toolbarButtonsName } from "#ports";
import {
	BackgroundColorToolbarButton,
	BoldToolbarButton,
	CodeToolbarButton,
	ColorToolbarButton,
	FontFamilyToolbarButton,
	FontSizeToolbarButton,
	IndentationToolbarButton,
	ItalicToolbarButton,
	LetterSpacingToolbarButton,
	LineHeightToolbarButton,
	LineLocalNameToolbarButton,
	LineSpacingToolbarButton,
	RemoveFormatToolbarButton,
	StrikethroughToolbarButton,
	SubscriptToolbarButton,
	SuperscriptToolbarButton,
	TextAlignToolbarButton,
	UnderlineToolbarButton,
} from "#ui-extensions";
import { createExtension } from "../_Utilities";

export const Formatting = createExtension({
	name: extensionsName.formatting,
	defaultSettings: {},
	createAdapter: (settings) => new FormattingAdapter(settings),
	configure: ({ adapter, editorAPI }) =>
		configureFormatting({ editorPort: adapter.editorPort, editorAPI }),
	components: {
		toolbarButtons: {
			[toolbarButtonsName.backgroundColor]: BackgroundColorToolbarButton,
			[toolbarButtonsName.bold]: BoldToolbarButton,
			[toolbarButtonsName.code]: CodeToolbarButton,
			[toolbarButtonsName.color]: ColorToolbarButton,
			[toolbarButtonsName.fontFamily]: FontFamilyToolbarButton,
			[toolbarButtonsName.fontSize]: FontSizeToolbarButton,
			[toolbarButtonsName.indentation]: IndentationToolbarButton,
			[toolbarButtonsName.italic]: ItalicToolbarButton,
			[toolbarButtonsName.letterSpacing]: LetterSpacingToolbarButton,
			[toolbarButtonsName.lineHeight]: LineHeightToolbarButton,
			[toolbarButtonsName.lineLocalName]: LineLocalNameToolbarButton,
			[toolbarButtonsName.lineSpacing]: LineSpacingToolbarButton,
			[toolbarButtonsName.removeFormat]: RemoveFormatToolbarButton,
			[toolbarButtonsName.strikethrough]: StrikethroughToolbarButton,
			[toolbarButtonsName.subscript]: SubscriptToolbarButton,
			[toolbarButtonsName.superscript]: SuperscriptToolbarButton,
			[toolbarButtonsName.textAlign]: TextAlignToolbarButton,
			[toolbarButtonsName.underline]: UnderlineToolbarButton,
		},
	},
});
