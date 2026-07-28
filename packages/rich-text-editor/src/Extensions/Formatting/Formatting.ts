import { type FontFamilyOption, FormattingAdapter } from "#adapters";
import { configureFormatting } from "#editor-extensions";
import { toolbarButtonsName } from "#ports";
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

const defaultFontFamilyOptions: FontFamilyOption[] = [
	// Loaded via FontStyles.css
	{ value: "Inter", group: "sans-serif" },
	// Generic CSS families and web-safe fonts — no loading required
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

export const Formatting = createExtension<typeof FormattingAdapter>({
	defaultSettings: { fontFamilyOptions: defaultFontFamilyOptions },
	createAdapter: (settings, options) =>
		new FormattingAdapter(settings, options),
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
