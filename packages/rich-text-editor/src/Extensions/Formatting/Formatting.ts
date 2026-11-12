import { Formatting as FormattingFactory } from "@rangex/editor/formatting";

import { toolbarButtonsName } from "#constants";
import type { FontFamilyOption } from "#context";
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
import type { FormattingExtensionSettings } from "./Formatting-types";

// Generic CSS families and web-safe fonts — no loading required
const defaultFontFamilyOptions: FontFamilyOption[] = [
	{ value: "system-ui", group: "sans-serif" },
	{ value: "Arial", group: "sans-serif" },
	{ value: "Helvetica", group: "sans-serif" },
	{ value: "Verdana", group: "sans-serif" },
	{ value: "Tahoma", group: "sans-serif" },
	{ value: "Trebuchet MS", group: "sans-serif" },
	{ value: "Georgia", group: "serif" },
	{ value: "Times New Roman", group: "serif" },
	{ value: "Courier New", group: "monospace" },
	{ value: "monospace", group: "monospace" },
];

export const Formatting = (settings: FormattingExtensionSettings): Extension => {
	const { fontFamilyOptions = defaultFontFamilyOptions, ...adapterSettings } = settings;

	return {
		createAdapter: () => FormattingFactory(adapterSettings),
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
		uiOptions: {
			formatting: { fontFamilyOptions },
		},
	};
};
