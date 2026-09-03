export type { EditorAPI } from "rich-text-area";
export type {
	BlockAlignValue,
	CaptionPosition,
	CaptionState,
	MediaType,
} from "#adapters";
export type { AccordionItemPublicPort } from "#adapters/AccordionItem";
export type {
	CodeBlockLanguage,
	CodeBlockPublicPort,
	CodeBlockTheme,
} from "#adapters/CodeBlock";
export type {
	EmptyMediaPublicPort,
	ResolveOption,
	UploadState,
} from "#adapters/EmptyMedia";
export type {
	FontFamilyOption,
	FormattingActionState,
	FormattingBackgroundColorState,
	FormattingBoldState,
	FormattingCodeState,
	FormattingColorState,
	FormattingFontFamilyState,
	FormattingFontFamilyValue,
	FormattingFontSizeState,
	FormattingFontSizeValue,
	FormattingIndentationState,
	FormattingIndentationValue,
	FormattingItalicState,
	FormattingLetterSpacingState,
	FormattingLineHeightState,
	FormattingLineHeightValue,
	FormattingLineLocalNameState,
	FormattingLineSpacingState,
	FormattingLineSpacingValue,
	FormattingPublicPort,
	FormattingStrikethroughState,
	FormattingSubscriptState,
	FormattingSuperscriptState,
	FormattingTextAlignState,
	FormattingTextAlignValue,
	FormattingUnderlineState,
} from "#adapters/Formatting";
export type { ImagePublicPort } from "#adapters/Image";

export type {
	CreateEditorParams,
	CreateEditorResult,
	RangeXEditor,
} from "#rangex-editor";
export { createEditor } from "#rangex-editor";
