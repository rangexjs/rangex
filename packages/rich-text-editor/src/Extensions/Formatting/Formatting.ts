import { Formatting as FormattingFactory } from "@rangex/editor/formatting";
import { toolbarButtonsName } from "#constants";
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
} from "#features";
import type { Extension } from "../_Utilities";

export const Formatting = (
	...adapterSettings: Parameters<typeof FormattingFactory>
): Extension => {
	return {
		createAdapter: () => FormattingFactory(...adapterSettings),
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
			floatingComponents: [],
		},
	};
};
