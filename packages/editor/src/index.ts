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
	FormattingBackgroundColorValue,
	FormattingBoldState,
	FormattingCodeState,
	FormattingColorState,
	FormattingColorValue,
	FormattingFontFamilyState,
	FormattingFontFamilyValue,
	FormattingFontSizeState,
	FormattingFontSizeValue,
	FormattingIndentationState,
	FormattingIndentationValue,
	FormattingItalicState,
	FormattingLetterSpacingState,
	FormattingLetterSpacingValue,
	FormattingLineHeightState,
	FormattingLineHeightValue,
	FormattingLineLocalNameState,
	FormattingLineLocalNameValue,
	FormattingLineSpacingState,
	FormattingLineSpacingValue,
	FormattingPublicPort,
	FormattingRemoveLineState,
	FormattingRemoveTextState,
	FormattingStrikethroughState,
	FormattingStructuredColor,
	FormattingStructuredThemeColors,
	FormattingSubscriptState,
	FormattingSuperscriptState,
	FormattingTextAlignState,
	FormattingTextAlignValue,
	FormattingUnderlineState,
} from "#adapters/Formatting";
export type { ImagePublicPort } from "#adapters/Image";
export type { ReadOnlyPublicPort } from "#adapters/ReadOnly";

export type {
	AdapterFactoryValue,
	CreateEditorParams,
	CreateEditorResult,
	RangeXEditor,
} from "#rangex-editor";
export {
	AccordionItem,
	createEditor,
	EmptyMedia,
	Formatting,
	Image,
} from "#rangex-editor";
